# Map sources:

## world.json

We used world json provided by [visionscarto-world-atlas](https://github.com/visionscarto/world-atlas) to generate topojson

```js
import * as topojson from "topojson-client";
import worldJson from "visionscarto-world-atlas/world/110m.json";
...

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string; a3: string };
}

...
const world = topojson.feature(worldJson, worldJson.objects.countries) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};
```

## \<country-code>-adm-\<level>.json

Data provided by [GADM License](https://gadm.org/license.html)
