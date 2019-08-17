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

/**
 * 在代码块中创建一个 copy 按钮以及防止代码块代码溢出
 * @param {HTMLElement} codeEle 
 */
export const copyButton = (codeEle) => {
  const $codeEle = $(codeEle);
  const $pre = $(codeEle.parentNode);
  const code = $codeEle.text();

  // 往 pre 下面加入一个 div，用于控制代码溢出
  const wrapper = document.createElement('div');
  // copy button
  const cpBtn = document.createElement('div');

  $(wrapper).css('overflow', 'auto');

  cpBtn.className = "copy-button";
  ReactDOM.render(<Button text={code}/>, cpBtn);

  $pre.append(wrapper);  
  $pre.append(cpBtn);
  $codeEle.appendTo(wrapper);
}