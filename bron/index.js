(function($){
    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 500;
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                $el.is(':input') && $el.on('keyup keypress',function(e){
                    if (e.type=='keyup' && e.keyCode!=8) return;
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function(){
                        doneTyping(el);
                    }, timeout);
                }).on('blur',function(){
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);

formValidation = {
	init: function(){
		this.$form = $('.registration-form');
		this.$firstName = this.$form.find('input[name="firstName"]');
		this.$lastName = this.$form.find('input[name="lastName"]');
		this.$phone = this.$form.find('input[name="phone"]');
		this.$submitButton = this.$form.find('button.submit');

		this.validatedFields = {
			firstName: false,
			lastName: false,
			phone: false
		};
		
		this.bindEvents();
	},
	bindEvents: function(){
		this.$firstName.donetyping(this.validateFirstNameHandler.bind(this));
		this.$lastName.donetyping(this.validateLastNameHandler.bind(this));
		this.$phone.donetyping(this.validatephoneHandler.bind(this));
		this.$form.submit(this.submitFormHandler.bind(this));
	},
	validateFirstNameHandler: function(){
		this.validatedFields.firstName = this.validateText(this.$firstName);
	},
	validateLastNameHandler: function(){
		this.validatedFields.lastName = this.validateText(this.$lastName);
	},
		validatephoneHandler: function(){
		this.validatedFields.phone = this.validateText(this.$phone);
	},
	submitFormHandler: function(e){
		e.preventDefault();
		this.validateFirstNameHandler();
		this.validateLastNameHandler();
		this.validatephoneHandler();
		if(this.validatedFields.firstName && this.validatedFields.lastName && this.validatedFields.phone){
			// Simulate Ajax loading
			this.$submitButton.addClass('loading').html('<span class="loading-spinner"></span>')
			setTimeout((function(){
				this.$submitButton.removeClass('loading').addClass('success').html('Дякуємо, '+this.$firstName.val())
			}).bind(this), 1500);
		}else{
			this.$submitButton.text('Заповніть усі поля');
			setTimeout((function(){
				if(this.$submitButton.text() == 'Заповніть усі поля'){
					this.$submitButton.text('Забронювати');
				}
			}).bind(this), 3000)
		}
	},
	
	validateText: function($input){
		$input.parent().removeClass('invalid');
		$input.parent().find('span.label-text small.error').remove();
		if($input.val() != ''){
			return true;
		}else{
			$input.parent().addClass('invalid');
			$input.parent().find('span.label-text').append(' <small class="error">(Поле пусте)</small>');
			return false;
		}
	},
}.init();