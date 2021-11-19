(function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  
  if(localStorage.getItem("fontsize")!=""&&localStorage.getItem("fontsize")!=undefined&&localStorage.getItem("fontsize")!=null){
		var fs=localStorage.getItem("fontsize");
		switch (fs){
			case "1":
				var fontsize=7.5;
				break;
			case "2":
				var fontsize=6.5;
				break;
			case "3":
				var fontsize=6;
				break;
			default:
				var fontsize=7.5;
				break;
		}
	}else{
		var fontsize=7.5;
	}
  function setRemUnit () {
    var rem = docEl.clientWidth / fontsize
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
