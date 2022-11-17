$(function () {
    const layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#chooseImage').click(function () {
        $('[type="file"]').click()
    })

    $('[type="file"]').on('change', function () {
        if (this.files.length !== 0) {
            const file = this.files[0]
            const url = URL.createObjectURL(file)
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', url)        // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        }
    })

    $('#upload').click(function () {
        // 将裁剪的图片转化为base64格式
        // base64格式要比源文件体积大30%，但是无需发送请求即可渲染
        // 因此base64格式可以减少请求次数，减轻服务器压力
        // 小图片可以转为base64格式，大图片不要转为base64格式
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})
