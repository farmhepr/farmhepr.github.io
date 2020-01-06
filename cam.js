window.addEventListener('load', function () {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader()
    console.log('ZXing code reader initialized')
    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('sourceSelect')
            selectedDeviceId = videoInputDevices[0].deviceId
            if (videoInputDevices.length >= 1) {
                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement('option')
                    sourceOption.text = element.label
                    sourceOption.value = element.deviceId
                    sourceSelect.appendChild(sourceOption)
                })
                sourceSelect.onchange = () => {
                    selectedDeviceId = sourceSelect.value;
                };
                const sourceSelectPanel = document.getElementById('sourceSelectPanel')
                sourceSelectPanel.style.display = 'block'
                sourceSelect.value = videoInputDevices[videoInputDevices.length - 1].deviceId
            }

            document.getElementById('startScanner').addEventListener('click', () => {
                document.getElementById('bar_code').value = '';
                startVideo(codeReader);
            })

            document.getElementById('searchCode').addEventListener('click', () => {
                codeReader.reset();
                console.log('Reset.')
            })

            document.getElementById('lists-form').addEventListener('click', () => {
                codeReader.reset();
                console.log('Reset.')
            })

            document.getElementById('sourceSelect').addEventListener('change', () => {
                codeReader.reset()
                codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                    if (result) {
                        console.log(result)
                        document.getElementById('bar_code').value = result.text
                    }
                    if (err && !(err instanceof ZXing.NotFoundException)) {
                        console.error(err)
                        alert(err)
                    }
                })
                console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
            })
            startVideo(codeReader);
        })
        .catch((err) => {
            console.error(err)
        })
})

function startVideo(codeReader) {
    var selectedDeviceId = document.getElementById('sourceSelect').value
    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
        if (result) {
            console.log(result)
            document.getElementById('bar_code').value = result.text
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err)
            document.getElementById('result').textContent = err
        }
    })
    console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
}