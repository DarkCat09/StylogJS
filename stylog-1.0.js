//<!--
/*
	Copyright 2020 Чечкенёв Андрей

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	
		http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

/*
 * StylogJS (Stylized Dialog for JavaScript) is a script for creating interesting dialogs
 * by one line of JS-code without using "non-beautiful" functions
 * alert, confirm and prompt.

  ****  ******* *   * *     ***   ***
 *         *     * *  *    *   * *
  ****     *      *   *    *   * *  **
      *    *      *   *    *   * *   *
  ****     *      *   ****  ***   ***

 * StylogJS 1.0
 */

try {
	// ISO-639-2 languages name standard
	language = (!language) ? "eng" : language;
}
catch (err) {
	const language = "eng";
}

const DBUTS_OK 					= 	language == "eng" ? ["OK"]	:
									language == "rus" ? ["OK"]	:
									language == "chi" ? ["好"]	:
							  							["OK"];
const DBUTS_OKCANCEL			= 	language == "eng" ? ["OK", "Cancel"]	:
									language == "rus" ? ["OK", "Отмена"]	:
									language == "chi" ? ["好", "取消"]		:
														["OK", "Cancel"];
const DBUTS_YESNO 				= 	language == "eng" ? ["Yes", "No"]	:
									language == "rus" ? ["Да", "Нет"]	:
									language == "chi" ? ["是", "沒有"]	:
								  						["Yes", "No"];
const DBUTS_YESNOCANCEL			=	language == "eng" ? ["Yes", "No", "Cancel"]	:
									language == "rus" ? ["Да", "Нет", "Отмена"]	:
									language == "chi" ? ["是", "沒有", "取消"] 	:
							  							["Yes", "No", "Cancel"];
const DBUTS_ABORTRETRYIGNORE	=	language == "eng" ? ["Abort", "Retry", "Ignore"]			:
									language == "rus" ? ["Прервать", "Повторить", "Пропустить"]	:
									language == "chi" ? ["中止", "重試", "忽視"]					:
						  								["Abort", "Retry", "Ignore"];

const DICON_NONE	= "";
const DICON_INFO	= "http://darkcat09.github.io/StylogJS/stdicons/icon_info.png";
const DICON_TICK	= "http://darkcat09.github.io/StylogJS/stdicons/icon_tick.png";
const DICON_QUEST	= "http://darkcat09.github.io/StylogJS/stdicons/icon_quest.png";
const DICON_ERROR	= "http://darkcat09.github.io/StylogJS/stdicons/icon_error.png";

const DTYPE_NONE	= 0;
const DTYPE_ALERT	= 1;
const DTYPE_CONFIRM	= 2;
const DTYPE_PROMPT	= 3;

var Stylog = function(dialogType, dialogText, dialogHeader, dialogIcon, dialogButtons, addCloseCross, useCssClassTarget, dialogId) {
	function getBtnsOfType(dType) {
		switch (dType) {
			case DTYPE_NONE:
				return null;
			case DTYPE_ALERT:
				return DBUTS_OK;
			case DTYPE_CONFIRM:
			case DTYPE_PROMPT:
				return DBUTS_OKCANCEL;
			default:
				return DBUTS_OK;
		};
	};

	this.type 			= (dialogType) ? (!isNaN(Number(dialogType)) ? Number(dialogType) : DTYPE_NONE) : DTYPE_NONE;
	this.text 			= (dialogText) ? dialogText : "";
	this.header 		= (dialogHeader) ? dialogHeader : "";
	this.buttons 		= (dialogButtons) ? ((dialogButtons.constructor === Array) ? dialogButtons : [String(dialogButtons)]) : getBtnsOfType(this.type);
	this.icon 			= (dialogIcon && dialogIcon !== "") ? dialogIcon : DICON_NONE;
	this.addCloseLink	= Boolean(addCloseCross);
	this.useCssTarget 	= Boolean(useCssClassTarget);
	this.htmlId 		= (dialogId && dialogId !== "") ? dialogId.replace(" ", "-") : "dialog";

	if (this.useCssTarget) {
		document.querySelector("body").insertAdjacentHTML("afterbegin",
			'<style>\n' +
				'.my-stylog-bg:target {\n' +
					'display: initial;\n' +
					'pointer-events: auto;\n' +
				'}\n' +
			'</style>\n'
		);
	}

	var index = 0;
	var button_text = this.buttons[index];
	var stylog_buttons_string = "";
	while (button_text) {
		button_text = this.buttons[index];
		stylog_buttons_string += '<button' + (index === 0 ? ' style = "background-color: cornflowerblue;"') + '>' + this.buttons[index] + '</button> ';
		index++;
	}

	this.dialogEl = document.createElement('div');
	this.dialogEl.className = "my-stylog-bg";
	this.dialogEl.id = this.htmlId;
	this.dialogEl.style.cssText =	'margin: 0; padding: 0; position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; width: 100%; height: 100%; ' +
									'background-color: rgba(0, 0, 0, 0.6); z-index: 9998; display: none; pointer-events: none; text-align: center;';
	this.dialogEl.innerHTML =	'<div class = "my-stylog">' + (addCloseLink ? '<span style = "float: right; cursor: pointer; text-decoration: none; ' +
								'color: inherit;"><a href = "' + ((this.useCssTarget === true) ? '#"' :
									'javascript:void(0);" onclick = "Stylog.hideDialog(\\"' +
								this.htmlId + '\\");"') + '>X</a></span>') + (this.type != DTYPE_NONE ? '<img src = "' + this.icon +
								'" width = "64" height = "64" /><br /><b>' + this.header + '</b><br />' + this.text + '<br />' +
								(this.type === DTYPE_PROMPT ? '<input type = "text" /><br />' : '') + '<div style = "float: right;">' +
								stylog_buttons_string + '</div>' : '') + this.text + '</div>';
	document.querySelector("body").prepend(this.dialogEl);
};

Stylog.prototype.show = function() {
	if (this.useCssTarget === true) {
		window.location.href += ("#" + this.htmlId);
	}
	else {
		this.dialogEl.style.display = "initial";
	}
};

Stylog.prototype.hide = function() {
	if (this.useCssTarget === true) {
		window.location = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search + "#";
	}
	else {
		this.dialogEl.style.display = "none";
	}
};

Stylog.showDialog = function(dialogId) {
	const errorMessage = "Stylog: Something happened in showDialog() function: ";
	try {
		document.getElementById(dialogId).style.display = "initial";
	}
	catch (err) {
		console.log(errorMessage + String(err));
		alert(errorMessage + String(err));
	}
};

Stylog.hideDialog = function(dialogId) {
	const errorMessage = "Stylog: Something happened in showDialog() function: ";
	try {
		document.getElementById(dialogId).style.display = "none";
	}
	catch (err) {
		console.log(errorMessage + String(err));
		alert(errorMessage + String(err));
	}
};
//-->