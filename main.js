class Area {
    constructor() {
        this.initTmap();

        this.polygons = [];
        this.data = null;
    }

    initTmap(polygon) {
        this.map = new Tmapv3.Map("map_div", {
            center: new Tmapv3.LatLng(37.56520450, 126.98702028),
            width: "100%",
            height: "100vh",
            zoom: 12
        });

        this.map.on("ConfigLoad", () => {
            this.startLoadFile();
        });
    }

    startLoadFile() {
        $.ajax({
            url: 'seoul_coordinates.geojson',
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                this.data = data.features;

                var coordinates = [];
                var name = [];
                var user_data = {};

                for (let i = 0; i < this.data.length; i++) {
                    coordinates = this.data[i].geometry.coordinates;
                    name.push(this.data[i].properties.temp);

                    if (name[i] == "종로구 사직동" || name[i] == "구로구 구로4동") {
                        user_data[name[i]] = '50';
                    } else {
                        user_data[name[i]] = '0';
                    }
                }

                var color = [];

                for (const key in user_data) {
                    console.log(key, user_data[key]);

                    if (user_data[key] < 3) {
                        color.push("#fff000");
                    } else if (user_data[key] >= 3 && user_data[key] < 10) {
                        color.push("#fff00");
                    } else if (user_data[key] >= 10) {
                        color.push("#FFFFFF");
                    }
                }

                for (let i = 0; i < this.data.length; i++) {
                    coordinates = this.data[i].geometry.coordinates;
                    this.displayArea(coordinates, color[i]);
                }
            }
        });
    }

    displayArea(coordinates, color) {
        var path = [];
        var point = [];
        var points = [];

        for (let j = 0; j < coordinates.length; j++) {
            for (let z = 0; z < coordinates[j].length; z++) {
                for (let x = 0; x < coordinates[j][z].length; x++) {
                    points = coordinates[j][z][x];

                    var temp = points[1];
                    points[1] = points[0];
                    points[0] = temp;

                    point.push(points);

                    path.push(new Tmapv3.LatLng(points[0], points[1]));
                }
            }
        }

        var polygon = new Tmapv3.Polygon({
            paths: path,
            fillColor: color,
            strokeColor: "#99ccff",
            strokeWeight: 1,
            map: this.map,
        });

        this.polygons.push(polygon);

        this.map.addListener(this.polygons, 'click', function(mouseEvent){
            this.polygons.setOption({fillColor: "#fff000"});
        });
    }
}

window.onload = () => {
    new Area();
}