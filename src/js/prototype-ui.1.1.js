var prototypeUI;

var prototypeUIToolkit = Class.create({

    initialize: function (options) {
        "use strict";

        // Assign Options to Default Vars
        this.truncateDefault = options.truncate; //Default Truncate Amount
        this.defaultSelect = options.defaultSelect; //Default Select Input
        this.defaultRadio = options.defaultRadio; // Default Radio Input
        this.defaultCheckbox = options.defaultCheckbox; // Default Checkboxes
        this.defaultIncrement = options.defaultIncrement; // Default Input for Increments

    },

    /*  Finds select elements, adds class name .custom if not already in existance,
     *  hides the select element visibility, and finds the parent element and sets the
     *  position to relative and creates a shiv element after the select.  For best results,
     *  wrap the select within a div.input-box wrapper.
     */

     customSelects: function (options) {

        // Determine What Select Elements will apply to this Method.
        this.selectElements = options.selectElements || this.defaultSelect;

        // Determine the Truncate Amount to be used.
        var selectTruncate = options.truncateAmount || this.truncateDefault;

        if(this.selectElements.length > 0){
            this.selectElements.each(function(el){
                var title, selectedEl;

                title = el.getAttribute('title');

                // Set Element Style of Select to Hide & Position Select
                el.setStyle({
                    zIndex: 10,
                    opacity: 0,
                    cursor: 'pointer',
                    position: 'absolute'
                }).addClassName('custom');

                // Apply Data Attribute of Truncate Value to Select so it's saved in the
                // DOM for later reference if needed.
                el.writeAttribute('data-truncate',selectTruncate);

                //  Update the Parent Container of the Select to position relative and
                //  add css class.
                el.up().setStyle({position: 'relative'}).addClassName('select-container');

                 // Get Inner Value of First Option if None are selected by Default.
                title = el.childElements().first().innerHTML.strip().truncate(selectTruncate);

                // Check to see if any options are selected and set title variable to content of selected option.
                selectedEl = el[el.selectedIndex].text;

                if(selectedEl.length > 0){
                    title = selectedEl.strip().truncate(selectTruncate);
                }

                //  Check to see if the custom element already has a custom-shiv
                //  associated with it.  If not, create the shiv element.  This will
                //  allow you to reinitialize custom selects when Ajax or other
                //  JS events occur.

                if(el.next('.custom-shiv') === undefined){
                    el.insert({
                        after:'<span class="custom-shiv">' + title + '<span></span></span>'
                    });
                }

                // Observe change in Select Elements and update shiv contents accordingly.
                el.observe('change', function(event){
                    this.updateShivs();
                }.bind(this));

                el.observe('mouseover', function(event){
                    el.next('.custom-shiv').addClassName('hover');
                });

                el.observe('mouseout', function(event){
                    el.next('.custom-shiv').removeClassName('hover');
                });

                this.updateSelects();

            }.bind(this));
        }

     },

     updateShivs: function(){

        // We're refreshing all the shivs on the page incase any javascript events
        // on the page trigger the change of any other Shivs as well.

        this.selectShiv = $$('.custom-shiv');

        this.selectShiv.each(function(el){

            var elSelect, valOption, valTruncate;

            elSelect = el.previous('select');
            valOption = elSelect[elSelect.selectedIndex].text;
            valTruncate = elSelect.readAttribute('data-truncate');

            el.update(valOption.strip().truncate(valTruncate) + '<span></span>');

        }.bind(this));

     },

     updateSelects: function(){

        this.selectShiv = $$('.custom-shiv');

        this.selectShiv.each(function(el){
            var elSelect;

            elSelect = el.previous('select');
            elSelect.setStyle({
                width: el.getWidth() + 'px',
                height: el.getHeight() + 'px'
            });
        });

     },

    /*
     *  Finds radio buttons and allows associated form labels to be used to stylize
     *  radio buttons.
     */

     customRadios: function(options){
        this.radioElements = options.radioElements || $$('input[type="radio"]');

        if(this.radioElements.length > 0){
            this.radioElements.each(function(el){
                var elLabel, typeLabel, valId;

                typeLabel = 'label';
                valId = el.readAttribute('id');

                if(el.next('label')){
                    elLabel = el.next('label');
                } else if(el.next('span.label')){
                    elLabel = el.next('span.label');
                    typeLabel = 'span';
                } else {
                    elLabel = false;
                }

                // If we reinstantate this method, we'll want to remove any classes
                // that may no longer apply.
                elLabel.removeClassName('radio-label').removeClassName('disabled').removeClassName('checked');

                 // Set Class for Labels that are clicked on page load.
                 if(el.checked && elLabel){
                    elLabel.addClassName('checked');
                 }

                if(elLabel){
                    // Add Class Name 'radio-label' to all labels associated with radio buttons.
                    elLabel.addClassName('radio-label');

                    // If element is disabled, add disabled class to label.
                    if(el.readAttribute('disabled') == 'disabled'){
                        elLabel.addClassName('disabled');
                    }

                    // Add extra styling to Radios to move them out of view.
                    el.setStyle({
                        position: 'absolute',
                        left: '-9999px'
                    });

                    // Setup Click Observe for Labels
                    elLabel.observe('click', function(event){

                        var labelRadio, inputRadio, groupRadio;
                        labelRadio = event.findElement(typeLabel);

                        if(typeLabel === 'label'){
                            radioInput = $(labelRadio.readAttribute('for'));
                        }else{
                            radioInput = $(labelRadio.previous('input'));
                        }

                        groupRadio = radioInput.readAttribute('name');

                        if(radioInput.readAttribute('disabled') !== 'disabled'){

                            // Disable Checked State for All Labels in the Group
                            this.updateRadioGroup(groupRadio, typeLabel);

                            // Support for Modern Browsers & IE9+
                            if($$('.ie7, .ie8').length > 0){
                                radioInput.checked = true;
                            }
                            labelRadio.addClassName('checked');
                        }
                    }.bind(this));
                }
            }.bind(this));
        }
     },

     updateRadioGroup: function(group, typeLabel){
        // Method to uncheck all Radios in a group, and remove any associated checked
        // state classes from their labels.
        $$('input[name="' + group + '"]').each(function(el){
            if($$('.ie7, .ie8').length <= 0){
                el.checked = false;
            }
            el.next(typeLabel).removeClassName('checked');
        });

     },

     customCheckboxes: function(options){
        this.checkboxElements = options.checkboxElements || this.defaultCheckbox;

        if(this.checkboxElements.length > 0){
            this.checkboxElements.each(function(el){
                var typeLabel, elLabel, valId;

                typeLabel = 'label';
                valId = el.readAttribute('id');

                if(el.next('label')){
                    elLabel = el.next('label');
                } else if(el.next('span.label')){
                    elLabel = el.next('span.label');
                    typeLabel = 'span';
                } else {
                    elLabel = false;
                }

                // If we reinstantate this method, we'll want to remove any classes
                // that may no longer apply.
                elLabel.removeClassName('checkbox-label').removeClassName('disabled').removeClassName('checked');

                 // Set Class for Labels that are clicked on page load.
                 if(el.checked && elLabel){
                    elLabel.addClassName('checked');
                 }

                 if(el.readAttribute('disabled') == 'disabled'){
                    elLabel.addClassName('disabled');
                }

                 if(elLabel){
                    el.setStyle({
                        position: 'absolute',
                        left:   '-9999px'
                    });

                    elLabel.addClassName('checkbox-label');

                    if(el.readAttribute('disabled') !== 'disabled'){
                        // Click Observe for Labels
                        elLabel.observe('click', function(event){
                            var inputCheckbox, labelCheckbox;

                            labelCheckbox = event.findElement(typeLabel);

                            if(typeLabel == 'label'){
                                inputCheckbox = $(event.findElement(typeLabel).readAttribute('for'));
                            }else{
                                inputCheckbox = $(event.findElement(typeLabel).previous('input'));
                            }

                            // Check to see if input is checked, and apply/remove class name if
                            // required.
                            if(inputCheckbox.checked){
                                labelCheckbox.removeClassName('checked');
                                if($$('.ie7, .ie8').length > 0){
                                    inputCheckbox.checked = false;
                                }
                            }else{
                                labelCheckbox.addClassName('checked');
                                if($$('.ie7, .ie8').length > 0){
                                    inputCheckbox.checked = true;
                                }
                            }
                        }.bind(this));
                    }
                 }

            }.bind(this));
        }
     },

     customIncrement: function(options){

        this.incrementField = options.incrementElement || this.defaultIncrement;

        this.minValue = options.valMinimum || 0;

        this.maxValue = options.valMaximum || 10000;

        this.incrementField.each(function(el){

            // Go up to parent container for positioning of increment buttons.
            el.up().setStyle({position: 'relative'});

            // Create Incrememnt Buttons
            el.insert({
                after: '<a class="increment-plus" data-for="' + el.readAttribute('id') + '">+</a><a class="increment-minus" data-for="' + el.readAttribute('id') + '">-</a>'
            });

            plusElement = el.next('.increment-plus');
            minusElement = el.next('.increment-minus');

            el.observe('change', function(event){
                var inputField = event.findElement('input');

                if(isNaN(inputField.value) === true){
                    inputField.value = this.minValue;
                }else if(inputField.value > this.maxValue){

                }else if(inputField.value < this.minValue){
                    inputField.value = this.minValue;
                }
            }.bind(this));

            plusElement.observe('click', function(event){
                var inputField = $(event.findElement('a').readAttribute('data-for'));
                if(isNaN(inputField.value) === false && inputField.value < this.maxValue){
                        inputField.value = parseFloat(inputField.value) + 1;
                }
                return false;
            }.bind(this));

            minusElement.observe('click', function(event){
                var inputField = $(event.findElement('a').readAttribute('data-for'));
                if(isNaN(inputField.value) === false && inputField.value > this.minValue){
                    inputField.value = parseFloat(inputField.value) - 1;
                }
                return false;
            }.bind(this));

        }.bind(this));

     }

});

Event.observe(window, 'load', function () {

    prototypeUI = new prototypeUIToolkit({
        truncate : '36',
        defaultSelect : $$('select'),
        defaultRadio: $$('input[type="radio"]'),
        defaultCheckbox: $$('input[type="checkbox"]'),
        defaultIncrement: $$('input.increment')
    });

}.bind(window));