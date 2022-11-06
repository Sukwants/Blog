function startsWith(s, str) {
  var len = str.length;
  if (len > s.length) {
    return false;
  }
  for (var i = 0; i < len; ++i) {
    if (s[i] != str[i]) {
      return false;
    }
  }
  return true;
}

function contentBox(args, content) {
  var type = 'note', title = 'Note', open = false;
  var len = args.length;
  for (var i = 0; i < len; ++i) {
    if (startsWith(args[i], 'type:')) {
      type = args[i].substring(5);
      if (title == 'Note') {
        title = type.substring(0, 1).toUpperCase() + type.substring(1);
      }
    }
    else if (startsWith(args[i], 'title:')) {
      title = args[i].substring(6);
    }
    else if (args[i] == 'open') {
      open = true;
    }
  }
  return '<details class="' + type + '"' + (open ? ' open' : '') + '><summary>' + title + '</summary>' + content + '</details>';
}

hexo.extend.tag.register('contentbox', contentBox, {ends: true});