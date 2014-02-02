(function (window) {
  //'use strict';

  // Cache the querySelector/All for easier and faster reuse
  $V  = document.querySelectorAll.bind(document);
  $VV = document.querySelector.bind(document);

  // Adding Array Iteration Loop
  // $('.foo').each(function ( ) { } );
  NodeList.prototype.forEach = Array.prototype.forEach;

  // Find Next Sibling
  function nextElementSibling(el) {
    do { el = el.nextSibling } while ( el && el.nodeType !== 1 )
    return el
  }

  // Find Previous Sibling
  function prevElementSibling(el) {
    do { el = el.prevSibling } while ( el && el.nodeType !== 1 )
    return el
  }


  // Event Listeners
  function addEventListener(el, eventName, handler){
    if(el.addEventListener){
      el.addEventListener(eventName, handler);
    }else{
      el.attachEvent('on' + eventName, handler);
    }
  }

  /*
   *
   *
   *
   */

    function vanillaUI(options){

      if(options){
        this.defaultTruncate = options.truncate;
        this.defaultSelect = options.select;
        this.defaultRadio = options.radio;
        this.defaultCheckbox = options.checkbox;
        this.defaultIncrement = options.increment;
      }else{
        this.defaultTruncate = 36;
        this.defaultSelect = $V('select');
        this.defaultRadio = $V('input[type="radio"]');
        this.defaultCheckbox = $V('input[type="checkbox"]');
        this.defaultIncrement = $V('input.increment');
      }

    }

    vanillaUI.prototype.customSelect = function(options){

      var selectElements,
          truncateAmount;

      if(options !== undefined){
        // Determine What Select Elements will apply to this Method.
        if(options.select !== undefined){
          selectElements = $V(options.select);
        }else{
          selectElements = this.defaultSelect;
        }

        if(options.truncate !== undefined){
          truncateAmount = options.truncate;
        }else{
          truncateAmount = this.defaultTruncate;
        }
      }else{
        selectElements = this.defaultSelect;
        truncateAmount = this.defaultTruncate;
      }

      if(selectElements.length > 0){
        selectElements.forEach(function(el){
          var title,
              selectedEl,
              elParent,
              elNext,
              elShivContent,
              elShiv;

          el.style.zIndex = 10;
          el.style.opacity = 0;
          el.style.filter = 'alpha(opacity="0")';
          el.style.cursor = 'pointer';
          el.style.position = 'absolute';

          if(el.classList){
            el.classList.add('custom')
          }else{
            el.className += ' custom';
          }

          el.setAttribute('data-truncate', truncateAmount);

          elParent = el.parentNode;

          elParent.style.position = 'relative';

          if(elParent.classList){
            elParent.classList.add('select-container');
          }else{
            elParent.className += ' select-container';
          }

          title = el.children[0].innerHTML.trim().substring(0,truncateAmount);

          selectedEl = el[el.selectedIndex].text;

          if(selectedEl.length > 0){
            title = selectedEl.trim().substring(0,truncateAmount);
          }

          if(el.nextElementSibling || nextElementSibling(el) === null){
            elShivContent = '<span class="custom-shiv">' + title + '<i></i></span>';
            el.insertAdjacentHTML('afterend', elShivContent);
          }
          elShiv = el.nextElementSibling || nextElementSibling(el);

          addEventListener(el, 'change', function(event){
            this.updateShivs();
          }.bind(this));

          addEventListener(el, 'mouseover', function(event){
            if(elShiv.classList){
              elShiv.classList.add('hover');
            }else{
              elShiv.className += ' hover';
            }
          });

          addEventListener(el, 'mouseout', function(event){
            if(elShiv.classList){
              elShiv.classList.remove('hover');
            }else{
              elShiv.className = elShiv.className.replace(new RegExp('(^| )' + className.split(' ').join('|') + '( |$)', 'gi'), ' ');
            }
          });

          this.updateSelects();

        }.bind(this));
      }

    };

    vanillaUI.prototype.updateShivs = function(){

      $V('.custom-shiv').forEach(function(el){
        var elSelect,
            valOption,
            valTruncate;

            elSelect = el.previousSibling || el.prevElementSibling;
            valTruncate = elSelect.getAttribute('data-truncate');
            valOption = elSelect[elSelect.selectedIndex].text;
            el.innerHTML = valOption.trim().substring(0,valTruncate) + '<i></i>';

      });

    };

    vanillaUI.prototype.updateSelects = function(){

      $V('.custom-shiv').forEach(function(el){
        var elSelect;

        elSelect = el.previousSibling || el.prevElementSibling;

        elSelect.style.width  = el.offsetWidth + 'px';
        elSelect.style.height = el.offsetHeight + 'px';
      });

    };

    var ui = new vanillaUI();

    document.addEventListener('DOMContentLoaded', function(){
      ui.customSelect({
        truncate: 35,
        select: 'select'
      });
    });

})();