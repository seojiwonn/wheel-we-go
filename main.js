var map;
var markers = [];
var selectMarkerIndex = -1;

function initTmap() {
    map = new Tmapv3.Map("map_div", {
        center: new Tmapv3.LatLng(37.56520450, 126.98702028),
        width: "100%",
        height: "100vh",
        zoom: 12
    });
}

function addMarker(lonlatoption) {
    var marker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(lonlatoption.lonlat.latitude(), lonlatoption.lonlat.longitude()),
        map: map,
        title: lonlatoption.title
    });
    markers.push(marker);
}
function clearMarker() {
    markers.forEach(function (marker) {
        marker.setMap(null);
    })
    markers = [];
}
function clearMarkerList() {
    var markerList = document.getElementById("markerList");
    markerList.innerHtml = '';
}

function searchPOI() {
    clearMarker();
    clearMarkerList();

    var center = map.getCenter();
    var optionObj = {
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        centerLon: map.getCenter().lng(),
        centerLat: map.getCenter().lat()
    };
    var params = {
        onComplete: onComplete,
        onProgress: onProgress,
        onError: onError
    };

    var inputValue = document.getElementById("search").value;

    if (inputValue.trim() != ''){
        var tData = new Tmapv3.extension.TData();
        tData.getPOIDataFromSearchJson(encodeURIComponent(inputValue), optionObj, params);
    }  
}

function onComplete() {
    console.log(this._responseData);
    var markerNameElement = document.getElementById("markerName");
    var markerList = document.getElementById("markerList");
    markerList.innerHTML = '';

    if (this._responseData.searchPoiInfo.pois.poi != '') {
        clearMarker();
        markers = [];
        clearMarkerList();

        jQuery(this._responseData.searchPoiInfo.pois.poi).each(function () {
            var name = this.name;
            var id = this.id;
            var lat = this.frontLat;  // 수정: 위도와 경도 순서 변경
            var lon = this.frontLon;
            var lonlatoption = {
                title: name,
                lonlat: new Tmapv3.LatLng(lat, lon)  // 수정: 위도와 경도 순서 변경
            };
            addMarker(lonlatoption);

            var listItem = document.createElement("li");
            listItem.textContent = name;
            listItem.addEventListener("click", function () {
                selectMarker(index);
                clearMarker();
                addMarker(lonlatoption);
                map.setCenter(markers[0].getPosition());
                markerNameElement.textContent = "선택된 마커: " + name;  // 이름 출력
            });
            markerList.appendChild(listItem);
        });
        map.setCenter(markers[0].getPosition());

        if (markers.length > 0) {
            var markerPosition = markers[0].getPosition();
            var latitude = markerPosition.lat();
            var longitude = markerPosition.lng();

            console.log(latitude, longitude);
        }
    } else {
        alert('검색결과가 없습니다.');
        markerNameElement.textContent = "";
    }
    // map.setCenter(new Tmapv3.LatLng(37.56520450, 126.98702028));
    map.setZoom(14);
}

function onProgress() { }

function onError() {
    alert("onError");
}

// 엔터키를 눌렀을 때 검색 실행
document.getElementById("search").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        searchPOI();
    }
});

window.onload = () => {
    initTmap();
}