// ==UserScript==
// @name         JSF btad Applicants
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://www.skatingjapan.jp/btad/admin_test_entry_list.aspx
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

//���w�����
$('table#ctl00_ContentPlaceHolder1_GridView').css('width','')

var previousRank = ''
$('table#ctl00_ContentPlaceHolder1_GridView tr').each(function(i,e){
    var td = $(e).children('td,th')
    var currentRank = $(td[3]).text()
    
    //���ŕ�����
    if(previousRank != "" && currentRank != previousRank){
        $('<tr><td colspan='+(td.length)+'></td></tr><tr style="height:4px;background-color:white !important;"><td></td><td></td><td colspan='+(td.length -2)+'></td>').insertBefore($(e))
    }
    if(currentRank == previousRank) $(td[3]).text('')
    
    //�ڍ׃{�^����A�Ԃɂ���
    $($(td[2]).children('input')).val(i).css({
        width: '34px',
        height: '30px',
        fontWeight: 'bold'
    }).parent().css('padding','0')
//    $('<td style="text-align:right;width:1em;">'+( i>0 ? i : '' )+'</td>').prependTo(e)
//    $(td[0]).remove()
//    $(td[1]).remove()

    //�ȃX�y�[�X
    $(td[3]).css('width','30px').text($(td[3]).text().replace(/��/,""))
    $(td[4]).css('width','80px')//���O
    $(td[5]).css({width:'16px', backgroundColor: $(td[5]).text() == "��" ? 'orange' : 'inherit'}).text($(td[5]).text().replace(/��|���l/,"��"))
    $(td[6]).text($(td[6]).text().replace(/^\s*$/,"��").replace(/��/,"-").replace(/�o�^/,"�o")).css({width:'16px', backgroundColor: $(td[6]).text() == "��" ? 'orange' : 'inherit'})
    $(td[9]).text($(td[9]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[10]).text($(td[10]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[11]).text($(td[11]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[12]).css('width','240px')
    previousRank = currentRank
})

/* CSS
table {
    border-collapse: collapse;
}

#aspnetForm > div:nth-child(9) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > contenttemplate > table > tbody > tr:nth-child(2) > td > div ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > table:nth-child(2) > tbody > tr > td > div ,#aspnetForm > div:nth-child(18) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > contenttemplate > table:nth-child(1) > tbody > tr:nth-child(2) > td > div {
    height: 1000px;
    overflow-y: scroll;
}
#ctl00_ContentPlaceHolder1_UpdatePanel2 tr:nth-child(2n) {
    background-color: #eee ;
}
#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr th:nth-child(1) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr th:nth-child(2) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr td:nth-child(1) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr td:nth-child(2) {
    display: none;
}
*/
