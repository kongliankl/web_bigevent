$(function () {
    const layer = layui.layer
    const form = layui.form

    initArticleList()
    // 获取文章分类列表
    function initArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    let index = null
    $('#addCate').click(function () {
        index = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArticleList()
                layer.msg('新增分类成功！')
                layer.close(index)
            }
        })
    })

    let indexEdit = null
    $('tbody').on('click', '.edit', function () {
        indexEdit = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        const Id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: `/my/article/cates/${Id}`,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                initArticleList()
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
            }
        })
    })

    $('tbody').on('click', '.delete', function () {
        const Id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: `/my/article/deletecate/${Id}`,
                success: function (res) {
                    if(res.status !== 0){
                        return layer.msg('删除分类失败！')
                    }
                    initArticleList()
                    layer.msg('删除分类成功！')
                }
            })
            layer.close(index);
        });
    })
})