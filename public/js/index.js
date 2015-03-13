var template = document.querySelector('.template');
var host = document.querySelector('.container');
var root = host.createShadowRoot();

root.appendChild(document.importNode(template.content, true));