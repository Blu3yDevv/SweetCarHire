export default function Instructions() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">How to Get 3D Car Models</h1>

        <div className="prose max-w-none">
          <h2>Option 1: Purchase Ready-Made 3D Models</h2>
          <p>The easiest way to get high-quality 3D car models is to purchase them from 3D marketplaces:</p>
          <ul>
            <li>
              <strong>TurboSquid</strong> -{" "}
              <a href="https://www.turbosquid.com/Search/3D-Models/car" target="_blank" rel="noopener noreferrer">
                https://www.turbosquid.com/Search/3D-Models/car
              </a>
            </li>
            <li>
              <strong>CGTrader</strong> -{" "}
              <a href="https://www.cgtrader.com/3d-models/car" target="_blank" rel="noopener noreferrer">
                https://www.cgtrader.com/3d-models/car
              </a>
            </li>
            <li>
              <strong>Sketchfab</strong> -{" "}
              <a
                href="https://sketchfab.com/3d-models/categories/cars-vehicles"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://sketchfab.com/3d-models/categories/cars-vehicles
              </a>
            </li>
          </ul>
          <p>Look for models in GLB or GLTF format, which work best with Three.js.</p>

          <h2>Option 2: Convert Existing 3D Models</h2>
          <p>
            If you have 3D models in other formats (like .obj, .fbx, or .blend), you can convert them to GLB format:
          </p>
          <ul>
            <li>
              <strong>Blender</strong> (Free) - Import your model and export as GLB
            </li>
            <li>
              <strong>Online converters</strong> like{" "}
              <a href="https://www.creators3d.com/online-viewer" target="_blank" rel="noopener noreferrer">
                Creators3D
              </a>{" "}
              or{" "}
              <a href="https://www.vectary.com" target="_blank" rel="noopener noreferrer">
                Vectary
              </a>
            </li>
          </ul>

          <h2>Option 3: Create Custom 3D Models</h2>
          <p>For completely custom models of your specific cars:</p>
          <ul>
            <li>
              Hire a 3D artist on platforms like{" "}
              <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer">
                Fiverr
              </a>{" "}
              or{" "}
              <a href="https://www.upwork.com" target="_blank" rel="noopener noreferrer">
                Upwork
              </a>
            </li>
            <li>Provide them with photos of your actual cars from multiple angles</li>
            <li>Request the models in GLB format optimized for web use</li>
          </ul>

          <h2>Optimizing 3D Models for Web</h2>
          <p>For the best performance on your website:</p>
          <ul>
            <li>Keep file sizes under 5MB if possible</li>
            <li>Reduce polygon count (aim for under 100k polygons)</li>
            <li>Use compressed textures</li>
            <li>
              Use the{" "}
              <a href="https://gltf.report/" target="_blank" rel="noopener noreferrer">
                glTF Report
              </a>{" "}
              tool to analyze and optimize your models
            </li>
          </ul>

          <h2>Adding Models to Your Website</h2>
          <p>Once you have your GLB files:</p>
          <ol>
            <li>
              Place them in the <code>/public/models/</code> folder of your project
            </li>
            <li>
              Update the <code>modelUrl</code> property in the fleet page to point to your model files
            </li>
            <li>Adjust the camera position and lighting in the Car3DViewer component if needed</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
