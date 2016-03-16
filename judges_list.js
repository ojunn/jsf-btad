/*
 * Copyright (c) 2016 ojunn
 * https://raw.githubusercontent.com/ojunn/jsf-btad/master/judges_list.js
 * 
 * This file is distributed under MIT License.
 * See LICENSE for more information.
 */
// ==UserScript==
// @name         JSF btad Judges List
// @author       ojunn
// @namespace    http://ojunn.github.io/jsf-btad/
// @updateURL    https://raw.githubusercontent.com/ojunn/jsf-btad/master/judges_list.js
// @downloadURL  https://raw.githubusercontent.com/ojunn/jsf-btad/master/judges_list.js
// @version      1.0
// @match        https://www.skatingjapan.jp/btad/admin_test_judge_reg.aspx
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @grant        GM_addStyle
// ==/UserScript==
/* jshint -W097 */

'use strict';

//CSS
GM_addStyle("\
    table {border-collapse: collapse;}\
    #ctl00_ContentPlaceHolder1_Panel3 table {margin: 0; width: 100% !important;}\
    #ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(1) ,#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(2) ,#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(3) ,#ctl00_ContentPlaceHolder1_Panel3 table:nth-child(2) {display: none;}\
    #ctl00_ContentPlaceHolder1_Panel3 td.style34 {width: 120px;}\
    #ctl00_ContentPlaceHolder1_Panel3 td.style35 {width: 80px;}\
    #ctl00_ContentPlaceHolder1_UpdatePanel2 > table > tbody > tr:nth-child(2) > td:first-child {width: 700px;}\
    select#ctl00_ContentPlaceHolder1_lstMember {height: 440px !important; width:215px !important;}\
    #ctl00_ContentPlaceHolder1_UpdatePanel2 > table > tbody > tr:nth-child(2) > td:first-child > div {overflow: scroll; height: 500px !important;}\
    input#ctl00_ContentPlaceHolder1_txtSeiKana, input#ctl00_ContentPlaceHolder1_txtMeiKana {width:124px !important;}\
");

//ボタンを押す度に描画しなおされるので毎回変更処理が必要
function executeSearchOnValueChanged(){
    var timeout_ms = 300

    //CSS
    $('#ctl00_ContentPlaceHolder1_Panel3').css('height', '');
    $('#ctl00_ContentPlaceHolder1_Panel3 table').css({height: ''});
    $('#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(6) td').prop('colspan','2')

    //検索の自動化、tabindex指定
    $('#ctl00_ContentPlaceHolder1_Panel3 input[type=text]').change(function(e){
        $('input#ctl00_ContentPlaceHolder1_btnSearch').click();
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    }).each(function(i,el){
        $(el).prop('tabindex', 200 + i)
    })
    $('input#ctl00_ContentPlaceHolder1_btnSearch').prop('tabindex', 100)
    $('select#ctl00_ContentPlaceHolder1_lstMember').prop('tabindex', 500)

    //検索結果の数で動作を変える
    if( $('select#ctl00_ContentPlaceHolder1_lstMember option').length >= 1){//1名以上ヒット
        var s = $('select#ctl00_ContentPlaceHolder1_lstMember')
        if(s.prop('selectedIndex') <0) s.prop('selectedIndex', 0)
        if($('select#ctl00_ContentPlaceHolder1_lstMember option').length ==1){
            //1名ヒットした場合はその人を追加する
            if($('#ctl00_ContentPlaceHolder1_lblMsg').text().length){
                //ただし、すでに追加済みの場合は追加せずに入力欄にフォーカスを戻す
                $('#ctl00_ContentPlaceHolder1_txtSeiKana').focus().select()
            }else{
                $('input#ctl00_ContentPlaceHolder1_btnAdd').click()
                setTimeout(executeSearchOnValueChanged, timeout_ms)
            }
        }else{
            //複数ヒットの場合は「名」にフォーカスする
            //s.focus()
            //$('#ctl00_ContentPlaceHolder1_txtMei').focus()
            $('#ctl00_ContentPlaceHolder1_txtMeiKana').focus()
        }            
    }else{
        //該当者なしの場合は入力欄にフォーカスを戻す
        //$('#ctl00_ContentPlaceHolder1_txtSei').focus().select()
        $('#ctl00_ContentPlaceHolder1_txtSeiKana').focus().select()
    }
    
    //名前のクリックで追加する
    $('select#ctl00_ContentPlaceHolder1_lstMember option').click(function(){
        $('input#ctl00_ContentPlaceHolder1_btnAdd').click()
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    })
    
    //名前のダブルクリックで追加する
    $('select#ctl00_ContentPlaceHolder1_lstMember option').dblclick(function(){
        $('input#ctl00_ContentPlaceHolder1_btnAdd').click()
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    })
    
    //削除ボタンの押下で再描画されるので対応しておく
    $('input[value=削除], input#ctl00_ContentPlaceHolder1_btnUpdate').click(function(e){
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    })
}

executeSearchOnValueChanged()

