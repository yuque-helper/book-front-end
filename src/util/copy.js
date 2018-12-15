import $ from 'jquery';
import ClipboardJS from 'clipboard';
import message from 'antd/lib/message';

import 'antd/lib/message/style/css';

export const copyButton = ($div) => {
  const $pre = $($div.parentNode);
  $pre.append(`<div class="copy-button" data-text="${$($div).text()}"><span class="bi-icon bi-icon-copy" title="复制"></span></div>`);
}

const clipboard = new ClipboardJS('.copy-button', {
  text: function(trigger) {
      return trigger.getAttribute('data-text');
  }
});

clipboard.on('success', () => {
  message.success('复制成功');
});

clipboard.on('error', (e) => {
  console.log(e);
  message.error('复制失败');
})