var pushEnd = [];
var list = {};
var iType = {};
var typeLen = 0;
var result = {"适龄儿童":[{"id":"6","text":"35"},{"id":"7","text":"36"},{"id":"8","text":"37"},{"id":"9","text":"38"},{"id":"10","text":"39"},{"id":"11","text":"40"}],"颜色":[{"id":"5","text":"白"},{"id":"4","text":"黑"},{"id":"3","text":"蓝"},{"id":"2","text":"绿"},{"id":"1","text":"红"}]}
var jsonStr = '[{"goodsNo":"47B94965286E48DC987A865E1C0ED9FC","stock":"66","price":"20","hasStock":"66","format":[{"id":"3","text":"蓝","name":"颜色"},{"id":"6","text":"35","name":"适龄儿童"}]},{"goodsNo":"D8D4B50CA5E441A1AF11122CE8DBDAF2","stock":"66","price":"20","hasStock":"66","format":[{"id":"5","text":"白","name":"颜色"},{"id":"6","text":"35","name":"适龄儿童"}]},{"goodsNo":"555A378839FA4B1CBCD3393C4DDE1354","stock":"66","price":"20","hasStock":"66","format":[{"id":"3","text":"蓝","name":"颜色"},{"id":"11","text":"40","name":"适龄儿童"}]},{"goodsNo":"3D2715611F6A4E1C81BF839F2C321D39","stock":"66","price":"20","hasStock":"66","format":[{"id":"5","text":"白","name":"颜色"},{"id":"11","text":"40","name":"适龄儿童"}]}]';
var isOver = true;

window.onload = function () {
    appendData()
};

function appendData() {
    for (var name in result) {
        typeLen++
        for (var i = 0; i < result[name].length; i++) {
            var r = result[name][i];
            iType[result[name][i].id] = {
                parentId: name,
                id: r.id,
                text: r.text,
                state: false
            };
        }
    }

    for (var i in iType) {
        if (list[iType[i].parentId]) {
            list[iType[i].parentId].push(iType[i]);
        } else {
            list[iType[i].parentId] = [];
            list[iType[i].parentId].push(iType[i]);
        }
    }

    if (jsonStr.length > 0 ) {
        jsonStr = JSON.parse(jsonStr);
        changeState(jsonStr);
    }

    function changeState(arr) {
        for (var i = 0; i < arr.length; i++) {
            var oDl = $('<dl></dl>').appendTo($('.set-type-body'));
            var str = '';
            for (var k = 0; k < arr[i].format.length; k++) {
                if (k == arr[i].format.length - 1) {
                    str += '"' + arr[i].format[k].text + '"'
                } else {
                    str += '"' + arr[i].format[k].text + '" + '
                }
                var iTypeId = arr[i].format[k].id
                iType[iTypeId].state = true;
            }
            pushEnd.push(arr[i].format);
            $('<dt>' + str + '</dt>').appendTo(oDl);
            $('<dd><input type="number"  placeholder="价格" value=' + arr[i].price + ' class="price"><input type="number" value="' + arr[i].hasStock + '"   placeholder="库存" class="inventory"></dd>').appendTo(oDl);
        }
    }

    var num = 0;
    for (var item in list) {
        var oGoodsType = $('<div class="goods-type"></div>').appendTo($('.type-container'));
        $('<h1>' + item + '分类</h1>').appendTo(oGoodsType);
        var type = $('<div class="type"></div>').appendTo(oGoodsType);
        var aTypes = $('<ul></ul>').appendTo(type);
        var len = list[item].length;
        var h = 84;
        if (len < 4) {
            h = 42;
            type.css({
                height: '42'
            });
        }
        for (var i = 0; i < len; i++) {

            ;(function (id, index) {
                var newLi = $('<li id="' + list[item][i].id + '">' + list[item][i].text + '</li>').bind('click', function () {

                    var _thisId = $(this).attr('id');
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        iType[id].state = false;
                        if (typeLen == 1) {

                            for (var k = 0; k < pushEnd.length; k++) {
                                for (var k = 0; k < pushEnd.length; k++) {
                                    if (pushEnd[k][index].id == iType[id].id) {
                                        pushEnd.splice(k, 1);
                                        $('.set-type-body dl').eq(k).remove();
                                        k--;
                                    }
                                }
                            }
                        } else {
                            if (pushEnd.length > 0) {
                                for (var k = 0; k < pushEnd.length; k++) {
                                    if (pushEnd[k][index].id == iType[id].id) {
                                        pushEnd.splice(k, 1);
                                        $('.set-type-body dl').eq(k).remove();
                                        k--;
                                    }
                                }
                            }
                        }
                        if (pushEnd.length == 0) {
                            $('.prompt').show();
                        }
                    } else {
                        $(this).addClass('active');
                        iType[id].state = true;

                        if (typeLen == 1) {
                            var arr = [];
                            arr.push(iType[id]);
                            pushEnd.push(arr);
                            var oDl = $('<dl></dl>').appendTo($('.set-type-body'));
                            $('<dt>' + iType[id].text + '</dt>').appendTo(oDl);
                            $('<dd><input  type="number" placeholder="价格" class="price"><input type="number"  placeholder="库存" class="inventory"></dd>').appendTo(oDl);
                            $('.prompt').hide();
                        } else {

                            var count = {};
                            var total = 0;
                            var data = [];
                            for (var name in list) {
                                if (name != iType[id].parentId) {
                                    for (var k = 0; k < list[name].length; k++) {
                                        if (list[name][k].state == true) {
                                            data.push(list[name][k]);
                                        }
                                    }
                                }
                            }

                            for (var h = 0; h < data.length; h++) {
                                if (count[data[h].parentId]) {
                                } else {
                                    count[data[h].parentId] = 1;
                                    total++;
                                }
                            }
                            if (total == typeLen - 1) {

                                setDate(data, index, iType[id], function () {
                                    $('#' + _thisId).removeClass('active');
                                    alert('最多现在20条商品规格');
                                });
                            }
                        }
                    }
                }).appendTo(aTypes);
                if (list[item][i].state == true) {
                    $(newLi).addClass('active');
                }
            })(list[item][i].id, num);
        }
        var oDropDown = $('<p class="arrow"></p>').bind('click', function () {
            len = $(this).closest('.type').find('ul li').length;

            var col = Math.ceil(len / 3);
            if (len >= 6) {
                h = 84
            }
            if ($(this).closest('.type').find('ul').hasClass('cur')) {
                $(this).closest('.type').find('ul').animate({
                    height: h
                });
                $(this).closest('.type').find('ul').removeClass('cur');
                $(this).css({
                    transform: 'rotate(0deg)'
                });
            } else {
                $(this).closest('.type').find('ul').animate({
                    height: col * 42
                });
                $(this).closest('.type').find('ul').addClass('cur');
                $(this).css({
                    transform: 'rotate(180deg)'
                });
            }
        }).appendTo(type);
        if (len > 6) {
            $(oDropDown).show();
        }
        num++;
    }

    $('#volume-set').bind('click', function () {
        if ($('.set-type-body dl').length == 0) {
            return;
        }
        $('.set-price').val('');
        $('.set-inventory').val('');
        $('.mask').show();
        $('.modal').show();
    });

    $('#change').bind('click', function () {
        $('.mask').hide();
        $('.modal').hide();
    });
    $('#confirm').bind('click', function () {
        var setPrice = $('.set-price').val();
        var setInventory = $('.set-inventory').val();

        if (setPrice.length > 0) {
            $('.price').val(setPrice);
        }
        if (setInventory.length > 0) {
            $('.inventory').val(setInventory);
        }

        $('.mask').hide();
        $('.modal').hide();

    });
    var oSetTypeBody = document.querySelector('.set-type-body');
    var aSetTypeBodys = oSetTypeBody.getElementsByTagName('dl');
    $('#submit').bind('click', function () {
        var allSel = [];
        if (pushEnd.length == 0) {
            alert('请选择商品规格');
        }

        for (var i = 0; i < pushEnd.length; i++) {
            var dataList = {};
            dataList.format = [];

            for (var j = 0; j < pushEnd[i].length; j++) {
                dataList.format.push({
                    id: pushEnd[i][j].id,
                    text: pushEnd[i][j].text
                });
            }

            var price = $(aSetTypeBodys[i]).find('input')[0].value;
            var stock = $(aSetTypeBodys[i]).find('input')[1].value;
            if (price.length == 0) {
                alert('请输入商品金额');
                break;
            }
            if (stock.length == 0) {
                stock = 0;
                alert('请输入库存');
                break;
            }

            dataList.price = price;
            dataList.stock = stock;
            allSel.push(dataList);
        }

        console.log(allSel);
    });
}

/**
 *
 * @param specItemList
 * @returns {Array}
 */
function generateTrRow(specItemList) {
    var specValueList = [];
    for (var i in specItemList) {
        var s = specItemList[i];
        specValueList.push(s);
    }
    var arrGroup = [],
        tempGroup = [];
    if (specValueList.length > 0) {
        var firstSpecValueList = specValueList[0];
        for (var i in firstSpecValueList) {
            tempGroup.push([firstSpecValueList[i]]);
        }
        specValueList.splice(0, 1);
        arrGroup = generateGroup(specValueList, tempGroup);
        return arrGroup;
    }
}
/**
 * 生成规格值组合的方法
 */
function generateGroup(arrSpecValueList, tempGroup) {
    for (var i in arrSpecValueList) {
        var s = arrSpecValueList[i];
        var newTempGroup = [];
        for (var j in tempGroup) {
            for (var k in s) {
                var tempOne = [];
                for (var x in tempGroup[j]) {
                    tempOne.push(tempGroup[j][x]);
                }
                tempOne.push(s[k]);
                newTempGroup.push(tempOne);
            }
        }
        if (newTempGroup.length > 0) {
            tempGroup = newTempGroup;
        }
    }
    return tempGroup;
}

/**
 *
 * @param data  除本次选中规格内外的所有选中元素
 * @param index 添加选中规格坐标
 */
function setDate(data, index, currentData, callback) {
    $('.prompt').hide();

    var json = {};
    for (var i = 0, l = data.length; i < l; i++) {
        if (json[data[i].parentId]) {
            json[data[i].parentId].push(data[i]);
        } else {
            json[data[i].parentId] = [];
            json[data[i].parentId].push(data[i]);
        }
    }
    var newData = generateTrRow(json);
    for (var i = 0; i < newData.length; i++) {
        newData[i].splice(index, 0, currentData);
        pushEnd.push(newData[i]);
    }
    if (pushEnd.length > 20) {
        callback();
        isOver = false;
        return;
    } else {
        isOver = true;
    }

    for (var i = 0; i < newData.length; i++) {
        var oDl = $('<dl></dl>').appendTo($('.set-type-body'));
        var str = '';
        for (var k = 0; k < newData[i].length; k++) {
            if (k == newData[i].length - 1) {
                str += '"' + newData[i][k].text + '"'
            } else {
                str += '"' + newData[i][k].text + '" + '
            }

        }
        $('<dt>' + str + '</dt>').appendTo(oDl);
        $('<dd><input type="number"  placeholder="价格" class="price"><input type="number" placeholder="库存"  class="inventory"></dd>').appendTo(oDl);
    }
}
