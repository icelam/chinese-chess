const injectScript = (content) => {
  const parentNode = document.getElementsByTagName('body')[0];
  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('type', 'text/javascript');
  scriptTag.setAttribute('nonce', process.env.APP_NONCE);
  scriptTag.innerHTML = content;
  parentNode.appendChild(scriptTag);
};

export default injectScript;
