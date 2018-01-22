import { element as $ } from 'angular'

class Message {
  constructor() {
    this.wrap = $('<div class="sl-message"></div>')
    document.body.appendChild(this.wrap[0])
  }

  create(type , ic , text, handler) {
    var html = '<div class="sl-message-notice"><div class="sl-message-notice-content"><div class="sl-message-custom-content sl-message-'+type+'"><i class="slicon fas fa-'+ic+'"></i><span>'+text+'</span></div></div></div>'

    var el = $(html)
    this.wrap.append(el)

    setTimeout(function() {
      el.remove();
      handler && handler()
    }, 2000);
  }

  destory() {

  }

  info(txt , handler) {
    this.create('info','info-circle' , txt, handler)
  }

  success(txt, handler) {
    this.create('success','check-circle' , txt, handler)
  }

  error(txt, handler) {
    this.create('error','times-circle' , txt, handler)
  }

  warn(txt, handler) {
    this.create('warn','exclamation-circle' , txt, handler)
  }

}

export default new Message()
