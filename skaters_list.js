/*
 * Copyright (c) 2016 ojunn
 * https://raw.githubusercontent.com/ojunn/jsf-btad/master/skaters_list.js
 * 
 * This file is distributed under MIT License.
 * See LICENSE for more information.
 */
// ==UserScript==
// @name         JSF btad Skaters List
// @author       ojunn
// @namespace    http://ojunn.github.io/jsf-btad/
// @updateURL    https://raw.githubusercontent.com/ojunn/jsf-btad/master/skaters_list.js
// @downloadURL  https://raw.githubusercontent.com/ojunn/jsf-btad/master/skaters_list.js
// @version      1.0
// @match        https://www.skatingjapan.jp/btad/admin_test_entry_list.aspx
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @grant        GM_addStyle
// ==/UserScript==
/* jshint -W097 */

'use strict';

//CSS
GM_addStyle("\
	table {border-collapse: collapse;}\
	#aspnetForm > div:nth-child(9) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > contenttemplate > table > tbody > tr:nth-child(2) > td > div ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > table:nth-child(2) > tbody > tr > td > div ,#aspnetForm > div:nth-child(18) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > contenttemplate > table:nth-child(1) > tbody > tr:nth-child(2) > td > div {height: 1000px !important; overflow-y: scroll;}\
	#ctl00_ContentPlaceHolder1_UpdatePanel2 tr:nth-child(2n) {background-color: #eee ;}\
	#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr th:nth-child(1) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr th:nth-child(2) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr td:nth-child(1) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr td:nth-child(2) {display: none;}\
");

//幅指定解除
$('table#ctl00_ContentPlaceHolder1_GridView').css('width','')

var previousRank = ''
$('table#ctl00_ContentPlaceHolder1_GridView tr').each(function(i,e){
    var td = $(e).children('td,th')
    var currentRank = $(td[3]).text()
    
    //級で分ける
    if(previousRank != "" && currentRank != previousRank){
        $('<tr><td colspan='+(td.length)+'></td></tr><tr style="height:4px;background-color:white !important;"><td></td><td></td><td colspan='+(td.length -2)+'></td>').insertBefore($(e))
    }
    if(currentRank == previousRank) $(td[3]).text('')
    
    //詳細ボタンを連番にする
    $($(td[2]).children('input')).val(i).css({
        width: '34px',
        height: '30px',
        fontWeight: 'bold'
    }).parent().css('padding','0')
//    $('<td style="text-align:right;width:1em;">'+( i>0 ? i : '' )+'</td>').prependTo(e)
//    $(td[0]).remove()
//    $(td[1]).remove()

    //省スペース、強調
    $(td[3]).css('width','30px').text($(td[3]).text().replace(/受験/,""))
    $(td[4]).css('width','80px')//名前
    $(td[5]).css({width:'16px', backgroundColor: $(td[5]).text() == "○" ? 'orange' : 'inherit'}).text($(td[5]).text().replace(/○|備考/,"備"))//備考
    $(td[6]).text($(td[6]).text().replace(/^\s*$/,"仮").replace(/◎/,"-").replace(/登録/,"登")).css({width:'16px', backgroundColor: $(td[6]).text() == "仮" ? 'orange' : 'inherit'})//登録
    $(td[9]).text($(td[9]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[10]).text($(td[10]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[11]).text($(td[11]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[12]).css('width','240px')
    if(!$(this).text().match(/受験/)){$(this).css({color: 'gray'})}//キャンセル
    previousRank = currentRank
})

