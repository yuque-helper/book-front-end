import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';


import {toc as getToc, getFirstSlugByToc} from '../../services';
import {toTreeToc, isJumpableSlug, getPathToParent, getDocKey} from './util';

import styles from './index.less';

class Sider extends React.Component{

  static propTypes = {
    slug: PropTypes.object,
    onChange: PropTypes.func
  }

  state = {
    toc: [],
    expanded: [],
    active: this.props.defaultSlug
  }

  async componentDidMount(){
    const toc = await getToc();
    const treeToc = toTreeToc(toc);

    let expanded = [];
    if(this.props.defaultSlug){
      expanded = getPathToParent(treeToc, toc, this.props.defaultSlug);
    } else {
      const firstSlug = getFirstSlugByToc(toc);
      expanded = getPathToParent(treeToc, toc, firstSlug);
    }

    this.setState({
      toc: treeToc,
      expanded: expanded
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.slug !== this.props.slug && nextProps.slug !== this.state.active){
      this.setState({
        active: nextProps.slug
      })
    }
  }

  onClick = (slug, key) => {
    return () => {
      if(slug === '#'){
        return;
      }
      this.trigger(key);
      this.props.onChange(slug);
    }
  }

  trigger = (key) => {
    const {expanded} = this.state;
    if(expanded.includes(key)){
      _.remove(expanded, k => k == key);
    } else {
      expanded.push(key);
    }

    this.setState({
      expanded: expanded
    });
  }

  renderSider = (toc) => {
    return (
      <div>
        {
          toc.map(t => {
            const hasChildren = t.children && t.children.length > 0;
            const canJump = isJumpableSlug(t.slug);
            const key = getDocKey(t);
            const isExpand = this.state.expanded.includes(key);

            return (
              <div 
                key={key}
                style={{ paddingLeft: 10 }}
              >
                <div 
                  className={classNames({
                    [styles.doc]: true,
                    [styles.active]: t.slug === this.state.active,
                    [styles.disable]: !canJump && !hasChildren
                  })}
                  onClick={this.onClick(t.slug, key)}
                > 
                  {
                    hasChildren
                    &&
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        this.trigger(key);
                      }}
                      className={
                        classNames(
                          'larkicon',
                          styles.trigger,
                          {
                            'larkicon-triangle-right-sw': !isExpand,
                            'larkicon-triangle-down-sw': isExpand
                          }
                        )
                      }
                    >
                    </span>
                  }
                  <a 
                    href={`${t.slug}.html`} 
                    onClick={(e)=> {
                      e.preventDefault();
                      if(!canJump){
                        this.trigger(key);
                      }
                    }}
                    style={{
                      cursor: canJump ? 'pointer': 'text'
                    }}
                    className={styles.title}
                  >
                    {t.title}
                  </a>
                </div>
                {
                  (hasChildren && isExpand) && (
                    this.renderSider(t.children)
                  )
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  render(){

    const {toc} = this.state;

    return (
      <div className={styles.sider}>
        {this.renderSider(toc)}
      </div>
    )
  }
}

export default Sider;