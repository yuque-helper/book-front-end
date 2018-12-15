import React from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import $ from 'jquery';

import {copyButton} from '../../util/copy';

import 'highlight.js/styles/github.css'
import styles from './index.less';

class Body extends React.Component{
  static propTypes = {
    doc: PropTypes.shape({
      title: PropTypes.string,
      body_html: PropTypes.string,
      slug: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string
      ])
    })
  }

  componentDidUpdate = (nextProps) => {
    if(nextProps.doc !== this.props.doc){
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
        copyButton(block);
      });
    }
  }

  render(){
    const {doc} = this.props;
    if(!doc){
      return null;
    }

    return (
      <div className={styles.container}>
        <div className={styles['doc-container'] + ' typo'}>
          <h1>{doc.title}</h1>
          <div dangerouslySetInnerHTML={{__html: doc.body_html}} ></div>
        </div>
      </div>
    )
  }
}

export default Body;