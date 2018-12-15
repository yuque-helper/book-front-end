import React from 'react';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import ClipboardJS from 'clipboard';
import message from 'antd/lib/message';
import Tooltip from 'antd/lib/tooltip';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import 'antd/lib/message/style/css';
import 'antd/lib/tooltip/style/css';

const Button = ({text}) => {
  return (
    <CopyToClipboard 
      text={text} 
      onCopy={() => {
        message.success('复制成功');
      }}
    >
      <Tooltip title="复制">
        <span className="bi-icon bi-icon-copy" title="复制"></span>
      </Tooltip>
    </CopyToClipboard>
  )
}

export const copyButton = ($div) => {
  const $pre = $($div.parentNode);
  const div = document.createElement('div');
  div.className = "copy-button";
  ReactDOM.render(<Button text={$($div).text()}/>, div);
  $pre.append(div);
}