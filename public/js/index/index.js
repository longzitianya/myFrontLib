/**
 * Created by longzitianya on 2016/12/21.
 */
;(function(){
    'use strict';
    //iframe窗
    $('#window').on('click', function(){
        layer.open({
            type: 2,
            title: '前端代码书写规范',
            shadeClose: true,
            shade: true,
            maxmin: true, //开启最大化最小化按钮
            area: ['1000px', '600px'],
            content: 'http://alloyteam.github.io/CodeGuide/'
        });
    });

})();
