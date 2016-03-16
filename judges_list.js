// ==UserScript==
// @name         JSF btad Judges List
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://www.skatingjapan.jp/btad/admin_test_judge_reg.aspx
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

//�{�^���������x�ɕ`�悵�Ȃ������̂Ŗ���ύX�������K�v
function executeSearchOnValueChanged(){
    var timeout_ms = 300
    
    /* �ȉ���CSS��K�p����Ɖ��K
    table {border-collapse: collapse;}
    #ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(1) ,#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(2) ,#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(3) ,#ctl00_ContentPlaceHolder1_Panel3 table:nth-child(2) {display: none;}
    #ctl00_ContentPlaceHolder1_Panel3 td.style34 {width: 120px;}
    #ctl00_ContentPlaceHolder1_Panel3 td.style35 {width: 80px;}
    select#ctl00_ContentPlaceHolder1_lstMember {height: 440px;}
    #ctl00_ContentPlaceHolder1_UpdatePanel2 > table > tbody > tr:nth-child(2) > td.style25:first-child {width: 700px;}
    #ctl00_ContentPlaceHolder1_UpdatePanel2 > table > tbody > tr:nth-child(2) > td.style25:first-child > div {height: 500px;overflow: scroll;}
    */
    //CSS��K�p�����ꍇ�́Ahide��css�̕��͕s�v�Bcolspan��rowspan�̕ύX�͕K�v
    $('#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(1)').hide()//�o�^�ԍ��ƌ����{�^��
    $('#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(2), #ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(3)').hide()//���O�i�����j
    //$('#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(4), #ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(5)').hide()//���O�i�ӂ肪�ȁj
    //$('#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(1) td:nth-child(3)').hide().prop('rowspan','3')
    $('#ctl00_ContentPlaceHolder1_Panel3 table tr:nth-child(6) td').prop('colspan','2')
    $('#ctl00_ContentPlaceHolder1_Panel3 table:nth-child(2)').hide()//�ǉ��{�^��
    $('#ctl00_ContentPlaceHolder1_Panel3 td.style34').css("width", '120px')
    $('#ctl00_ContentPlaceHolder1_Panel3 td.style35').css("width", '80px')
    $('select#ctl00_ContentPlaceHolder1_lstMember').css("height", "440px")
    $('#ctl00_ContentPlaceHolder1_UpdatePanel2 > table > tbody > tr:nth-child(2) > td:first-child').css({width: "700px"})
    $('#ctl00_ContentPlaceHolder1_UpdatePanel2 > table > tbody > tr:nth-child(2) > td:first-child > div').css({overflow: "scroll", height: "500px"})

    //�����̎������Atabindex�w��
    $('#ctl00_ContentPlaceHolder1_Panel3 input[type=text]').change(function(e){
        $('input#ctl00_ContentPlaceHolder1_btnSearch').click();
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    }).each(function(i,el){
        $(el).prop('tabindex', 200 + i)
    })
    $('input#ctl00_ContentPlaceHolder1_btnSearch').prop('tabindex', 100)
    $('select#ctl00_ContentPlaceHolder1_lstMember').prop('tabindex', 500)

    //�������ʂ̐��œ����ς���
    if( $('select#ctl00_ContentPlaceHolder1_lstMember option').length >= 1){//1���ȏ�q�b�g
        var s = $('select#ctl00_ContentPlaceHolder1_lstMember')
        if(s.prop('selectedIndex') <0) s.prop('selectedIndex', 0)
        if($('select#ctl00_ContentPlaceHolder1_lstMember option').length ==1){
            //1���q�b�g�����ꍇ�͂��̐l��ǉ�����
            if($('#ctl00_ContentPlaceHolder1_lblMsg').text().length){
                //�������A���łɒǉ��ς݂̏ꍇ�͒ǉ������ɓ��͗��Ƀt�H�[�J�X��߂�
                $('#ctl00_ContentPlaceHolder1_txtSeiKana').focus().select()
            }else{
                $('input#ctl00_ContentPlaceHolder1_btnAdd').click()
                setTimeout(executeSearchOnValueChanged, timeout_ms)
            }
        }else{
            //�����q�b�g�̏ꍇ�́u���v�Ƀt�H�[�J�X����
            //s.focus()
            //$('#ctl00_ContentPlaceHolder1_txtMei').focus()
            $('#ctl00_ContentPlaceHolder1_txtMeiKana').focus()
        }            
    }else{
        //�Y���҂Ȃ��̏ꍇ�͓��͗��Ƀt�H�[�J�X��߂�
        //$('#ctl00_ContentPlaceHolder1_txtSei').focus().select()
        $('#ctl00_ContentPlaceHolder1_txtSeiKana').focus().select()
    }
    
    //���O�̃N���b�N�Œǉ�����
    $('select#ctl00_ContentPlaceHolder1_lstMember option').click(function(){
        $('input#ctl00_ContentPlaceHolder1_btnAdd').click()
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    })
    
    //���O�̃_�u���N���b�N�Œǉ�����
    $('select#ctl00_ContentPlaceHolder1_lstMember option').dblclick(function(){
        $('input#ctl00_ContentPlaceHolder1_btnAdd').click()
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    })
    
    //�폜�{�^���̉����ōĕ`�悳���̂őΉ����Ă���
    $('input[value=�폜], input#ctl00_ContentPlaceHolder1_btnUpdate').click(function(e){
        setTimeout(executeSearchOnValueChanged, timeout_ms)
    })
}

executeSearchOnValueChanged()

