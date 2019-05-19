(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){e.extend(e.fn,{validate:function(t){if(!this.length){if(t&&t.debug&&window.console){console.warn("Nothing selected, can't validate, returning nothing.")}return}var i=e.data(this[0],"validator");if(i){return i}this.attr("novalidate","novalidate");i=new e.validator(t,this[0]);e.data(this[0],"validator",i);if(i.settings.onsubmit){this.on("click.validate",":submit",function(t){if(i.settings.submitHandler){i.submitButton=t.target}if(e(this).hasClass("cancel")){i.cancelSubmit=true}if(e(this).attr("formnovalidate")!==undefined){i.cancelSubmit=true}});this.on("submit.validate",function(t){if(i.settings.debug){t.preventDefault()}function r(){var r,s;if(i.settings.submitHandler){if(i.submitButton){r=e("<input type='hidden'/>").attr("name",i.submitButton.name).val(e(i.submitButton).val()).appendTo(i.currentForm)}s=i.settings.submitHandler.call(i,i.currentForm,t);if(i.submitButton){r.remove()}if(s!==undefined){return s}return false}return true}if(i.cancelSubmit){i.cancelSubmit=false;return r()}if(i.form()){if(i.pendingRequest){i.formSubmitted=true;return false}return r()}else{i.focusInvalid();return false}})}return i},valid:function(){var t,i,r;if(e(this[0]).is("form")){t=this.validate().form()}else{r=[];t=true;i=e(this[0].form).validate();this.each(function(){t=i.element(this)&&t;r=r.concat(i.errorList)});i.errorList=r}return t},rules:function(t,i){var r=this[0],s,n,a,o,l,u;if(r==undefined){if(this.debug){console.error("元素["+this.selector+"]不存在！")}return}if(t){s=e.data(r.form,"validator").settings;n=s.rules;a=e.validator.staticRules(r);switch(t){case"add":e.extend(a,e.validator.normalizeRule(i));delete a.messages;n[r.name]=a;if(i.messages){s.messages[r.name]=e.extend(s.messages[r.name],i.messages)}break;case"remove":if(!i){delete n[r.name];return a}u={};e.each(i.split(/\s/),function(t,i){u[i]=a[i];delete a[i];if(i==="required"){e(r).removeAttr("aria-required")}});return u}}o=e.validator.normalizeRules(e.extend({},e.validator.classRules(r),e.validator.attributeRules(r),e.validator.dataRules(r),e.validator.staticRules(r)),r);if(o.required){l=o.required;delete o.required;o=e.extend({required:l},o);e(r).attr("aria-required","true")}if(o.remote){l=o.remote;delete o.remote;o=e.extend(o,{remote:l})}return o}});e.extend(e.expr[":"],{blank:function(t){return!e.trim(""+e(t).val())},filled:function(t){return!!e.trim(""+e(t).val())},unchecked:function(t){return!e(t).prop("checked")}});e.validator=function(t,i){this.settings=e.extend(true,{},e.validator.defaults,t);this.currentForm=i;this.init()};e.validator.format=function(t,i){if(arguments.length===1){return function(){var i=e.makeArray(arguments);i.unshift(t);return e.validator.format.apply(this,i)}}if(arguments.length>2&&i.constructor!==Array){i=e.makeArray(arguments).slice(1)}if(i.constructor!==Array){i=[i]}e.each(i,function(e,i){t=t.replace(new RegExp("\\{"+e+"\\}","g"),function(){return i})});return t};e.extend(e.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusCleanup:false,focusInvalid:true,errorContainer:e([]),errorLabelContainer:e([]),onsubmit:true,ignore:":hidden",ignoreTitle:false,onfocusin:function(e){this.lastActive=e;if(this.settings.focusCleanup){if(this.settings.unhighlight){this.settings.unhighlight.call(this,e,this.settings.errorClass,this.settings.validClass)}this.hideThese(this.errorsFor(e))}},onfocusout:function(e){if(!this.checkable(e)&&(e.name in this.submitted||!this.optional(e))){this.element(e)}},onkeyup:function(t,i){var r=[16,17,18,20,35,36,37,38,39,40,45,144,225];if(i.which===9&&this.elementValue(t)===""||e.inArray(i.keyCode,r)!==-1){return}else if(t.name in this.submitted||t===this.lastElement){this.element(t)}},onclick:function(e){if(e.name in this.submitted){this.element(e)}else if(e.parentNode.name in this.submitted){this.element(e.parentNode)}},highlight:function(t,i,r){if(t.type==="radio"){this.findByName(t.name).addClass(i).removeClass(r)}else{e(t).addClass(i).removeClass(r)}},unhighlight:function(t,i,r){if(t.type==="radio"){this.findByName(t.name).removeClass(i).addClass(r)}else{e(t).removeClass(i).addClass(r)}}},setDefaults:function(t){e.extend(e.validator.defaults,t)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date ( ISO ).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:e.validator.format("Please enter no more than {0} characters."),minlength:e.validator.format("Please enter at least {0} characters."),rangelength:e.validator.format("Please enter a value between {0} and {1} characters long."),range:e.validator.format("Please enter a value between {0} and {1}."),max:e.validator.format("Please enter a value less than or equal to {0}."),min:e.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){this.labelContainer=e(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||e(this.currentForm);this.containers=e(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var t=this.groups={},i;e.each(this.settings.groups,function(i,r){if(typeof r==="string"){r=r.split(/\s/)}e.each(r,function(e,r){t[r]=i})});i=this.settings.rules;e.each(i,function(t,r){i[t]=e.validator.normalizeRule(r)});function r(t){var i=e.data(this.form,"validator"),r="on"+t.type.replace(/^validate/,""),s=i.settings;if(s[r]&&!e(this).is(s.ignore)){s[r].call(i,this,t)}}e(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], "+"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], "+"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], "+"[type='radio'], [type='checkbox']",r).on("click.validate","select, option, [type='radio'], [type='checkbox']",r);if(this.settings.invalidHandler){e(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler)}e(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){this.checkForm();e.extend(this.submitted,this.errorMap);this.invalid=e.extend({},this.errorMap);if(!this.valid()){e(this.currentForm).triggerHandler("invalid-form",[this])}this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var e=0,t=this.currentElements=this.elements();t[e];e++){this.check(t[e])}return this.valid()},element:function(t){var i=this.clean(t),r=this.validationTargetFor(i),s=true;this.lastElement=r;if(r===undefined){delete this.invalid[i.name]}else{this.prepareElement(r);this.currentElements=e(r);s=this.check(r)!==false;if(s){delete this.invalid[r.name]}else{this.invalid[r.name]=true}}e(t).attr("aria-invalid",!s);if(!this.numberOfInvalids()){this.toHide=this.toHide.add(this.containers)}this.showErrors();return s},showErrors:function(t){if(t){e.extend(this.errorMap,t);this.errorList=[];for(var i in t){this.errorList.push({message:t[i],element:this.findByName(i)[0]})}this.successList=e.grep(this.successList,function(e){return!(e.name in t)})}if(this.settings.showErrors){this.settings.showErrors.call(this,this.errorMap,this.errorList)}else{this.defaultShowErrors()}},resetForm:function(){if(e.fn.resetForm){e(this.currentForm).resetForm()}this.submitted={};this.lastElement=null;this.prepareForm();this.hideErrors();var t,i=this.elements().removeData("previousValue").removeAttr("aria-invalid");if(this.settings.unhighlight){for(t=0;i[t];t++){this.settings.unhighlight.call(this,i[t],this.settings.errorClass,"")}}else{i.removeClass(this.settings.errorClass)}},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(e){var t=0,i;for(i in e){t++}return t},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(e){e.not(this.containers).text("");this.addWrapper(e).hide()},valid:function(){return this.size()===0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid){try{e(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(t){}}},findLastActive:function(){var t=this.lastActive;return t&&e.grep(this.errorList,function(e){return e.element.name===t.name}).length===1&&t},elements:function(){var t=this,i={};return e(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){if(!this.name&&t.settings.debug&&window.console){console.error("%o has no name assigned",this)}if(this.name in i||!t.objectLength(e(this).rules())){return false}i[this.name]=true;return true})},clean:function(t){return e(t)[0]},errors:function(){var t=this.settings.errorClass.split(" ").join(".");return e(this.settings.errorElement+"."+t,this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=e([]);this.toHide=e([]);this.currentElements=e([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},prepareElement:function(e){this.reset();this.toHide=this.errorsFor(e)},elementValue:function(t){var i,r=e(t),s=t.type;if(s==="radio"||s==="checkbox"){return this.findByName(t.name).filter(":checked").val()}else if(s==="number"&&typeof t.validity!=="undefined"){return t.validity.badInput?false:r.val()}i=r.val();if(typeof i==="string"){return i.replace(/\r/g,"")}return i},check:function(t){t=this.validationTargetFor(this.clean(t));var i=e(t).rules(),r=e.map(i,function(e,t){return t}).length,s=false,n=this.elementValue(t),a,o,l;for(o in i){l={method:o,parameters:i[o]};try{a=e.validator.methods[o].call(this,n,t,l.parameters);if(a==="dependency-mismatch"&&r===1){s=true;continue}s=false;if(a==="pending"){this.toHide=this.toHide.not(this.errorsFor(t));return}if(!a){this.formatAndAdd(t,l);return false}}catch(u){if(this.settings.debug&&window.console){console.log("Exception occurred when checking element "+t.id+", check the '"+l.method+"' method.",u)}if(u instanceof TypeError){u.message+=".  Exception occurred when checking element "+t.id+", check the '"+l.method+"' method."}throw u}}if(s){return}if(this.objectLength(i)){this.successList.push(t)}return true},customDataMessage:function(t,i){return e(t).data("msg"+i.charAt(0).toUpperCase()+i.substring(1).toLowerCase())||e(t).data("msg")},customMessage:function(e,t){var i=this.settings.messages[e];return i&&(i.constructor===String?i:i[t])},findDefined:function(){for(var e=0;e<arguments.length;e++){if(arguments[e]!==undefined){return arguments[e]}}return undefined},defaultMessage:function(t,i){return this.findDefined(this.customMessage(t.name,i),this.customDataMessage(t,i),!this.settings.ignoreTitle&&t.title||undefined,e.validator.messages[i],"<strong>Warning: No message defined for "+t.name+"</strong>")},formatAndAdd:function(t,i){var r=this.defaultMessage(t,i.method),s=/\$?\{(\d+)\}/g;if(typeof r==="function"){r=r.call(this,i.parameters,t)}else if(s.test(r)){r=e.validator.format(r.replace(s,"{$1}"),i.parameters)}this.errorList.push({message:r,element:t,method:i.method});this.errorMap[t.name]=r;this.submitted[t.name]=r},addWrapper:function(e){if(this.settings.wrapper){e=e.add(e.parent(this.settings.wrapper))}return e},defaultShowErrors:function(){var e,t,i;for(e=0;this.errorList[e];e++){i=this.errorList[e];if(this.settings.highlight){this.settings.highlight.call(this,i.element,this.settings.errorClass,this.settings.validClass)}this.showLabel(i.element,i.message)}if(this.errorList.length){this.toShow=this.toShow.add(this.containers)}if(this.settings.success){for(e=0;this.successList[e];e++){this.showLabel(this.successList[e])}}if(this.settings.unhighlight){for(e=0,t=this.validElements();t[e];e++){this.settings.unhighlight.call(this,t[e],this.settings.errorClass,this.settings.validClass)}}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return e(this.errorList).map(function(){return this.element})},showLabel:function(t,i){var r,s,n,a=this.errorsFor(t),o=this.idOrName(t),l=e(t).attr("aria-describedby");if(a.length){a.removeClass(this.settings.validClass).addClass(this.settings.errorClass);a.html(i)}else{a=e("<"+this.settings.errorElement+">").attr("id",o+"-error").addClass(this.settings.errorClass).html(i||"");r=a;if(this.settings.wrapper){r=a.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()}if(this.labelContainer.length){this.labelContainer.append(r)}else if(this.settings.errorPlacement){this.settings.errorPlacement(r,e(t))}else{r.insertAfter(t)}if(a.is("label")){a.attr("for",o)}else if(a.parents("label[for='"+o+"']").length===0){n=a.attr("id").replace(/(:|\.|\[|\]|\$)/g,"\\$1");if(!l){l=n}else if(!l.match(new RegExp("\\b"+n+"\\b"))){l+=" "+n}e(t).attr("aria-describedby",l);s=this.groups[t.name];if(s){e.each(this.groups,function(t,i){if(i===s){e("[name='"+t+"']",this.currentForm).attr("aria-describedby",a.attr("id"))}})}}}if(!i&&this.settings.success){a.text("");if(typeof this.settings.success==="string"){a.addClass(this.settings.success)}else{this.settings.success(a,t)}}this.toShow=this.toShow.add(a)},errorsFor:function(t){var i=this.idOrName(t),r=e(t).attr("aria-describedby"),s="label[for='"+i+"'], label[for='"+i+"'] *";if(r){s=s+", #"+r.replace(/\s+/g,", #")}return this.errors().filter(s)},idOrName:function(e){return this.groups[e.name]||(this.checkable(e)?e.name:e.id||e.name)},validationTargetFor:function(t){if(this.checkable(t)){t=this.findByName(t.name)}return e(t).not(this.settings.ignore)[0]},checkable:function(e){return/radio|checkbox/i.test(e.type)},findByName:function(t){return e(this.currentForm).find("[name='"+t+"']")},getLength:function(t,i){switch(i.nodeName.toLowerCase()){case"select":return e("option:selected",i).length;case"input":if(this.checkable(i)){return this.findByName(i.name).filter(":checked").length}}return t.length},depend:function(e,t){return this.dependTypes[typeof e]?this.dependTypes[typeof e](e,t):true},dependTypes:{"boolean":function(e){return e},string:function(t,i){return!!e(t,i.form).length},"function":function(e,t){return e(t)}},optional:function(t){var i=this.elementValue(t);return!e.validator.methods.required.call(this,i,t)&&"dependency-mismatch"},startRequest:function(e){if(!this.pending[e.name]){this.pendingRequest++;this.pending[e.name]=true}},stopRequest:function(t,i){this.pendingRequest--;if(this.pendingRequest<0){this.pendingRequest=0}delete this.pending[t.name];if(i&&this.pendingRequest===0&&this.formSubmitted&&this.form()){e(this.currentForm).submit();this.formSubmitted=false}else if(!i&&this.pendingRequest===0&&this.formSubmitted){e(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=false}},previousValue:function(t){return e.data(t,"previousValue")||e.data(t,"previousValue",{old:null,valid:true,message:this.defaultMessage(t,"remote")})},destroy:function(){this.resetForm();e(this.currentForm).off(".validate").removeData("validator")}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},number:{number:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(t,i){if(t.constructor===String){this.classRuleSettings[t]=i}else{e.extend(this.classRuleSettings,t)}},classRules:function(t){var i={},r=e(t).attr("class");if(r){e.each(r.split(" "),function(){if(this in e.validator.classRuleSettings){e.extend(i,e.validator.classRuleSettings[this])}})}return i},normalizeAttributeRule:function(e,t,i,r){if(/min|max/.test(i)&&(t===null||/number|range|text/.test(t))){r=Number(r);if(isNaN(r)){r=undefined}}if(r||r===0){e[i]=r}else if(t===i&&t!=="range"){e[i]=true}},attributeRules:function(t){var i={},r=e(t),s=t.getAttribute("type"),n,a;for(n in e.validator.methods){if(n==="required"){a=t.getAttribute(n);if(a===""){a=true}a=!!a}else{a=r.attr(n)}this.normalizeAttributeRule(i,s,n,a)}if(i.maxlength&&/-1|2147483647|524288/.test(i.maxlength)){delete i.maxlength}return i},dataRules:function(t){var i={},r=e(t),s=t.getAttribute("type"),n,a;for(n in e.validator.methods){a=r.data("rule"+n.charAt(0).toUpperCase()+n.substring(1).toLowerCase());this.normalizeAttributeRule(i,s,n,a)}return i},staticRules:function(t){var i={},r=e.data(t.form,"validator");if(r.settings.rules){i=e.validator.normalizeRule(r.settings.rules[t.name])||{}}return i},normalizeRules:function(t,i){e.each(t,function(r,s){if(s===false){delete t[r];return}if(s.param||s.depends){var n=true;switch(typeof s.depends){case"string":n=!!e(s.depends,i.form).length;break;case"function":n=s.depends.call(i,i);break}if(n){t[r]=s.param!==undefined?s.param:true}else{delete t[r]}}});e.each(t,function(r,s){t[r]=e.isFunction(s)?s(i):s});e.each(["minlength","maxlength"],function(){if(t[this]){t[this]=Number(t[this])}});e.each(["rangelength","range"],function(){var i;if(t[this]){if(e.isArray(t[this])){t[this]=[Number(t[this][0]),Number(t[this][1])]}else if(typeof t[this]==="string"){i=t[this].replace(/[\[\]]/g,"").split(/[\s,]+/);t[this]=[Number(i[0]),Number(i[1])]}}});if(e.validator.autoCreateRanges){if(t.min!=null&&t.max!=null){t.range=[t.min,t.max];delete t.min;delete t.max}if(t.minlength!=null&&t.maxlength!=null){t.rangelength=[t.minlength,t.maxlength];delete t.minlength;delete t.maxlength}}return t},normalizeRule:function(t){if(typeof t==="string"){var i={};e.each(t.split(/\s/),function(){i[this]=true});t=i}return t},addMethod:function(t,i,r){e.validator.methods[t]=i;e.validator.messages[t]=r!==undefined?r:e.validator.messages[t];if(i.length<3){e.validator.addClassRules(t,e.validator.normalizeRule(t))}},methods:{required:function(t,i,r){if(!this.depend(r,i)){return"dependency-mismatch"}if(i.nodeName.toLowerCase()==="select"){var s=e(i).val();return s&&s.length>0}if(this.checkable(i)){return this.getLength(t,i)>0}return t.length>0},email:function(e,t){return this.optional(t)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e)},url:function(e,t){return this.optional(t)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(e)},date:function(e,t){return this.optional(t)||!/Invalid|NaN/.test(new Date(e).toString())},dateISO:function(e,t){return this.optional(t)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(e)},number:function(e,t){return this.optional(t)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)},digits:function(e,t){return this.optional(t)||/^\d+$/.test(e)},creditcard:function(e,t){if(this.optional(t)){return"dependency-mismatch"}if(/[^0-9 \-]+/.test(e)){return false}var i=0,r=0,s=false,n,a;e=e.replace(/\D/g,"");if(e.length<13||e.length>19){return false}for(n=e.length-1;n>=0;n--){a=e.charAt(n);r=parseInt(a,10);if(s){if((r*=2)>9){r-=9}}i+=r;s=!s}return i%10===0},minlength:function(t,i,r){var s=e.isArray(t)?t.length:this.getLength(t,i);return this.optional(i)||s>=r},maxlength:function(t,i,r){var s=e.isArray(t)?t.length:this.getLength(t,i);return this.optional(i)||s<=r},rangelength:function(t,i,r){var s=e.isArray(t)?t.length:this.getLength(t,i);return this.optional(i)||s>=r[0]&&s<=r[1]},min:function(e,t,i){return this.optional(t)||e>=i},max:function(e,t,i){return this.optional(t)||e<=i},range:function(e,t,i){return this.optional(t)||e>=i[0]&&e<=i[1]},equalTo:function(t,i,r){var s=e(r);if(this.settings.onfocusout){s.off(".validate-equalTo").on("blur.validate-equalTo",function(){e(i).valid()})}return t===s.val()},remote:function(t,i,r){if(this.optional(i)){return"dependency-mismatch"}var s=this.previousValue(i),n,a;if(!this.settings.messages[i.name]){this.settings.messages[i.name]={}}s.originalMessage=this.settings.messages[i.name].remote;this.settings.messages[i.name].remote=s.message;r=typeof r==="string"&&{url:r}||r;if(s.old===t){return s.valid}s.old=t;n=this;this.startRequest(i);a={};a[i.name]=t;e.ajax(e.extend(true,{mode:"abort",port:"validate"+i.name,dataType:"json",data:a,context:n.currentForm,success:function(r){var a=r===true||r==="true",o,l,u;n.settings.messages[i.name].remote=s.originalMessage;if(a){u=n.formSubmitted;n.prepareElement(i);n.formSubmitted=u;n.successList.push(i);delete n.invalid[i.name];n.showErrors()}else{o={};l=r||n.defaultMessage(i,"remote");o[i.name]=s.message=e.isFunction(l)?l(t):l;n.invalid[i.name]=true;n.showErrors(o)}s.valid=a;n.stopRequest(i,a)}},r));return"pending"}}});var t={},i;if(e.ajaxPrefilter){e.ajaxPrefilter(function(e,i,r){var s=e.port;if(e.mode==="abort"){if(t[s]){t[s].abort()}t[s]=r}})}else{i=e.ajax;e.ajax=function(r){var s=("mode"in r?r:e.ajaxSettings).mode,n=("port"in r?r:e.ajaxSettings).port;if(s==="abort"){if(t[n]){t[n].abort()}t[n]=i.apply(this,arguments);return t[n]}return i.apply(this,arguments)}}});