//////////////////////////////////////////////////////////////////////
// DEPENDENCIES
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const songTheaterVideo = $('#song-theater-video')
const songTheaterLeft = $('#song-theater-left')
const songTheaterMiddle = $('#song-theater-middle')
const songTheaterRight = $('#song-theater-right')
const songContribute = $('#song-contribute')
const songSubmit = $('#song-submit')
const songCancel = $('#song-cancel')

//////////////////////////////////////////////////////////////////////
// PROPERTIES
//////////////////////////////////////////////////////////////////////

const videos = JSON.parse(songTheaterVideo.attr('data-videos'))
let videoIndex = 0

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function songTheaterLeft_onClick()
{
    --videoIndex
    if (videoIndex < 0)
    {
        videoIndex = videos.length - 1
    }
    songTheaterVideo.attr('src', videos[videoIndex])
    songTheaterMiddle.text(`${videoIndex + 1} of ${videos.length}`)
}

function songTheaterRight_onClick()
{
    ++videoIndex
    if (videoIndex >= videos.length)
    {
        videoIndex = 0
    }
    songTheaterVideo.attr('src', videos[videoIndex])
    songTheaterMiddle.text(`${videoIndex + 1} of ${videos.length}`)
}

function songContribute_onClick()
{
    songContribute.toggleClass('hidden', true)
    songSubmit.toggleClass('hidden', false)
    songCancel.toggleClass('hidden', false)
}

function songCancel_onClick()
{
    songContribute.toggleClass('hidden', false)
    songSubmit.toggleClass('hidden', true)
    songCancel.toggleClass('hidden', true)
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

songTheaterLeft.on('click', songTheaterLeft_onClick)
songTheaterRight.on('click', songTheaterRight_onClick)
songContribute.on('click', songContribute_onClick)
songCancel.on('click', songCancel_onClick)