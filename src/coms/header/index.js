import React from 'react';
import {book as getBook} from '../../services/index';
import { Input, AutoComplete, Icon} from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './index.less';
const { Option } = AutoComplete;

class Header extends React.Component{
  state = {
    book: {},
    options: []
  }

  static propTypes = {
    docSearch: PropTypes.object,
    docsearchTitle: PropTypes.object,
    docToc: PropTypes.array,
    onChange: PropTypes.func
  }

  async componentDidMount(){
    const book = await getBook();
    this.setState({
      book
    });
    window.document.getElementsByTagName('title')[0].innerText = book.name;
  }


  handleSearch = (value) => {
    const {docSearch, docToc, docsearchTitle} = this.props;
    if ( (docsearchTitle[value] && docsearchTitle[value].length) || (docSearch[value] && docSearch[value].length)) {
      let mergearr = _.concat(docsearchTitle[value] || [], docSearch[value] || []);
      mergearr = _.uniq(mergearr);
      let arr = [];
      console.info('mergearr==', mergearr)
      console.info('docToc==', docToc)

      for (let i = 0; i < mergearr.length; i++) {
        let detailToc = _.find(docToc, (o) => { return o.doc_id === mergearr[i]});
        if (detailToc) {
          arr.push({
            title: detailToc.title ? detailToc.title.replace(value, `<b>${value}</b>`) : '',
            titleTip: detailToc.title,
            slug: detailToc.doc_id
          })
        }
      }

      this.setState({
        options: arr
      });
    } else {
      this.setState({
        options: []
      });
    }
  }
  onSelect = (value) => {
    const {docToc, onChange} = this.props;
    let detailToc = _.find(docToc, (o) => { return o.doc_id == value});
    onChange(detailToc.slug)
  };

  renderOption = (item) => {

    return (
      <Option  key={item.slug} text={item.titleTip}>
        <div title={item.titleTip} className="global-search-item">
          <span dangerouslySetInnerHTML={{ __html:  item.title}} className="global-search-item-desc">
          </span>
        </div>
      </Option>
    );
  }
  

  render(){
    const {book, options} = this.state;
    const {docSearch} = this.props;


    return (
      <div className={styles.header}>
        <div className={styles.title}>
          {book.name}
          {docSearch && <AutoComplete
              className={styles.search}
              size="large"
              dataSource={options.map(this.renderOption)}
              style={{ width: '300px',border: '0px'}}
              onSelect={this.onSelect}
              onSearch={this.handleSearch}
              placeholder="input here"
              optionLabelProp="text"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          }
        </div>
      </div>
    )
  }
}

export default Header;