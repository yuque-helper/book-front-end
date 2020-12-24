import React from 'react';
import _ from 'lodash';
import {connect} from 'dva';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';

import Body from '../coms/body';
import Sider from '../coms/sider';
import Header from '../coms/header';
import {getQuery, getSearch} from '../util/query';
import {doc, getFirstSlug, searchDoc, searchTitle, toc} from '../services/index';

import styles from './IndexPage.less';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false
});

class Index extends React.Component{
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }),
    location: PropTypes.object,
    headless: false
  }

  state = {
    docBody: null,
    docSearch: null,
    docsearchTitle: null,
    docToc: []
  }

  // 获取当前的slug
  getSlug = (location = this.props.location) => {
    let slug = location.pathname.replace(/\.html$/, '');
    if(slug.startsWith('/')){
      slug = slug.replace(/^\//, '');
    }
    return slug;
  }

  async componentDidMount(){
    const {location} = this.props;
    const slug = this.getSlug(location);
    const search = _.get(this, 'props.location.search')
    const query = getQuery(search);

    if(query.headless === 'true') {
      this.setState({
        headless: true
      });
    }

    const docSearch = await searchDoc();
    const docsearchTitle = await searchTitle();
    const docToc = await toc();

    this.setState({
      docSearch: docSearch,
      docsearchTitle: docsearchTitle,
      docToc: docToc
    });

    if(slug){
      this.getDocByLocation(location); 
    } else {
      // 获取最近的一个slug
      const firstSlug = await getFirstSlug();
      if(firstSlug){
        this.onChange(firstSlug);
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      const slug = this.getSlug(nextProps.location);

      this.onChange(slug);
    }
  }

  getDocByLocation = (location) => {
    const slug = this.getSlug(location);
    if(!this.state.docBody){
      this.onChange(slug);
    }
  }

  onChange = async (slug) => {
    const {history, location} = this.props;
    const query = getQuery(location.search);

    delete query.anchor;

    location.pathname = `/${slug}.html`;
    location.search = getSearch(query);

    history.push(location);
    NProgress.start();

    try{
      const docBody = await doc(slug);

      this.setState({
        docBody: docBody
      });
    } catch(e){
      console.log(e);
    }

    NProgress.done();
  }

  render(){
    const {docBody, headless, docSearch, docToc, docsearchTitle} = this.state;

    return (
      <div className={styles.normal}>
        {
          !headless && <Header docsearchTitle={docsearchTitle}  docSearch={docSearch} docToc={docToc} onChange={this.onChange}/>
        }
        <div className={styles.body}>
          {
            !headless && (
              <Sider 
                onChange={this.onChange}
                defaultSlug={this.getSlug()}
                slug={this.getSlug()}
              />
            )
          }
          <Body doc={docBody} />
        </div>
      </div>
    );
  }
}

export default connect()(Index);
