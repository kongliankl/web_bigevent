$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage

    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())
        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                const htmlStr = template('tpl-table', res)
                $('.layui-table tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initList()
    function initList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                const htmlStr = template('getList', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }

    $("#form-filter").submit(function (e) {
        e.preventDefault()
        q.cate_id = $('[name="cate_id"]').val()
        q.state = $('[name="state"]').val()
        initTable()
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump回调的三种方式：
            // 1.点击页码的时候
            // 2.切换条目数的时候（limit）
            // 3.调用laypage.render()的时候
            jump: function (obj, first) {
                // console.log(obj.curr)
                // console.log(obj.first)
                q.pagesize = obj.limit
                q.pagenum = obj.curr
                // 直接调用会发生死循环
                // initTable()
                // 可以通过first的值来判断触发jump回调的方式：
                // first值为undefined，则是第一种方式
                // first值为true，则是第三种方式
                if (!first) {
                    initTable()
                }
            }
        })
    }

    $('body').on('click', '.delete', function () {
        // 获取页面中删除按钮的个数
        const num = $('.delete').length
        const id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: `/my/article/delete/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 如果删除按钮只剩一个，删除成功后，则需让页码减1
                    // 当页码已经等于1时，无需再减1
                    if (num === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 如果删除后当前页没有数据了，则让页码减1，再调用initTable()
                    initTable()
                }
            })
            layer.close(index)
        })
    })

    $('body').on('click', '.edit', function () {
        const id = $(this).attr('data-id')
        const htmlStr = template('changeArticle')
        $(".layui-card").html(htmlStr)

        // 初始化富文本编辑器
        initEditor()
        // 1. 初始化图片裁剪器
        var $image = $('#image')
        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
        $image.cropper(options)

        initCate()
        function initCate() {
            $.ajax({
                method: 'get',
                url: '/my/article/cates',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('获取文章类别失败！')
                    }
                    const htrmlStr = template('tep-select', res)
                    $('[name="cate_id"]').html(htrmlStr)
                    form.render()

                }
            })
        }
        $.ajax({
            method: 'get',
            url: `/my/article/${id}`,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败')
                }
                console.log(res)
                form.val('form-pub', res.data)
                $('.cover-left img').attr('src', res.data.cover_img)
            }
        })
    })
})