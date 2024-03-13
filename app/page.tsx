"use client"
import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Draw from 'ol/interaction/Draw';

const App: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource({ wrapX: false }));

  type DrawType = any

  useEffect(() => {
    const raster = new TileLayer({
      source: new OSM(),
    });

    const vector = new VectorLayer({
      source: vectorSourceRef.current,
    });

    const map = new Map({
      layers: [raster, vector],
      target: mapRef.current!,
      view: new View({
        center: [-111000000, 2600000],
        zoom: 4,
      }),
    });

    const typeSelect = document.getElementById('type') as HTMLSelectElement;

    let draw: Draw;

    const addInteraction = () => {
      const value = typeSelect.value;
      if (value !== 'None') {
        draw = new Draw({
          source: vectorSourceRef.current,
          type: value as DrawType, 
        });
        map.addInteraction(draw);
      }
    };

    typeSelect.addEventListener('change', () => {
      map.removeInteraction(draw);
      addInteraction();
    });

    document.getElementById('undo')!.addEventListener('click', () => {
      draw.removeLastPoint();
    });

    addInteraction();

    return () => {
      map.setTarget();
    };
  }, []);

  return (
    <div>
      <div id="map" className="map" style={{width:'100%',height:'400px'}} ref={mapRef}></div>
      <div className="row">
        <div className="col-auto mx-7 my-5">
          <span className="input-group">
            <label className="input-group-text mx-2 text-xl font-serif" htmlFor="type">
              Geometry type:
            </label>
            <select className="form-select mx-2 border border-gray-600" id="type">
              <option value="None">None</option>
              <option value="Point">Point</option>
              <option value="LineString">Line</option>
              <option value="Polygon">Polygon</option>
            </select>
            <input className="form-control cursor-pointer" type="button" value="Undo" id="undo" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
