$(function () {
    const layer = layui.layer
    const form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

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

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btncoverFile').click(function () {
        $('#coverFile').click()
    })

    $('#coverFile').change(function (e) {
        var file = e.target.files
        if (file.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    let state = '已发布'
    $("#save2").click(function () {
        state = '草稿'
    })

    $("#form-pub").submit(function (e) {
        e.preventDefault()
        const fd = new FormData($(this)[0])
        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                pubArticle(fd)
            })
    })
    function pubArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = './art_list.html'
            }
        })
    }
})