import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import qs from 'query-string';
import hljs from 'highlight.js';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import inViewport from 'in-viewport';
import {withRouter} from 'dva/router';

import {copyButton} from '../../util/copy';

import 'highlight.js/styles/github.css'
import styles from './index.less';

const MAX_LEVEL = 4;

class Body extends React.Component{
  static propTypes = {
    doc: PropTypes.shape({
      title: PropTypes.string,
      body_html: PropTypes.string,
      slug: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string
      ])
    }),
    location: PropTypes.shape({
      search: PropTypes.string
    }),
    history: PropTypes.shape({
      push: PropTypes.func
    })
  }

  state = {
    toc: [],
    activeTocId: null
  }

  componentDidUpdate = (nextProps) => {
    if(nextProps.doc !== this.props.doc){
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
        copyButton(block);
      });

      this.initDocToc();
    }
  }

  componentDidMount = () => {
    const search = _.get(this, 'props.location.search');

    // 锚点恢复
    if(search) {
      const query = qs.parse(search);
      const anchor = query.anchor;
      if(anchor) {
        this.setState({
          activeTocId: anchor
        });

        // FIXME: 锚点恢复, 不一定能等到dom生成了才执行
        setTimeout(this.toView(anchor), 100);
      }
    }
  }

  // 初始化右侧toc
  initDocToc = () => {
    const div = $('#yuque-book-container');

    const isaAnchor = (ele) => {
      return ele.find('a').length && ele.text().trim() !== ''; 
    }

    /**
     * 
     * @param {element} element 需要遍历的元素
     * @param {number} level h级别
     * @param {number} depth 遍历深度
     */
    const findChildren = (element, level, depth) => {
      if(level >= MAX_LEVEL) {
        return [];
      }

      const eles = $(element).find(`h${level}[id]`);
      const tree = [];

      for(let ele of eles) {
        ele = $(ele);
        if(isaAnchor(ele)) {
          tree.push({
            ele,
            depth,
            title: ele.text(),
            id: ele.attr('id'),
            children: findChildren(ele, level + 1, depth + 1),
            level: level
          })
        }
      }

      if(!tree.length) {
        return findChildren(element, level + 1, depth);
      }

      return tree;
    }

    let tree = findChildren(div, 1, 0) || [];

    this.setState({
      toc: _.flattenDeep(tree)
    }, this.onScroll);
  }

  onScroll = () => {
    const {toc} = this.state;
    for(let item of toc) {
      const ele = _.get(item,'ele[0]');
      if(!ele) {
        continue;
      }

      if(inViewport(ele)){
        this.setState({
          activeTocId: item.id
        });

        return;
      }
    }
  }

  toView = (id) => {
    return () => {
      document.getElementById(id).scrollIntoView(true);
      this.props.history.push({
        search: qs.stringify({
          anchor: id
        })
      })
    };
  }

  render(){
    const {doc} = this.props;
    if(!doc){
      return null;
    }

    const {toc, activeTocId} = this.state;

    return (
      <div onScroll={this.onScroll} className={styles.container + " lake-engine-view"} >
        <div className={styles['doc-container'] + ' typo'} id="yuque-book-container">
          <h1>{doc.title}</h1>
          <div dangerouslySetInnerHTML={{__html: doc.body_html}} ></div>
          <div className={styles['doc-wrapper']}>
          <div className={styles['doc-toc']}>
            {
              toc.map(item => {
                return (
                  <div 
                    className={
                      classnames(
                        styles['doc-item'], 
                        `doc-link-${item.depth}`, 
                        {
                          [styles['doc-item-active']]: activeTocId === item.id
                        }
                      )
                    }
                    onClick={this.toView(item.id)}
                  >
                    {
                      item.title
                    }
                  </div>
                )
              })
            }
          </div>   
          </div>       
        </div>
      </div>
    )
  }
}

export default withRouter(Body);