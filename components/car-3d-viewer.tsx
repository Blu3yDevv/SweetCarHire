"use client"

import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Loader2 } from "lucide-react"

interface Car3DViewerProps {
  modelUrl: string
  specs: {
    name: string
    value: string
  }[]
}

export function Car3DViewer({ modelUrl, specs }: Car3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSpec, setActiveSpec] = useState<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(5, 2, 5)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.outputEncoding = THREE.sRGBEncoding
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 10, 7.5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20)
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.5,
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true
    scene.add(plane)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 3
    controls.maxDistance = 10
    controls.maxPolarAngle = Math.PI / 2

    // Load 3D model
    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 3 / maxDim
        model.scale.set(scale, scale, scale)
        model.position.sub(center.multiplyScalar(scale))
        model.position.y = 0.01 // Slightly above the ground

        scene.add(model)
        setLoading(false)
      },
      undefined,
      (error) => {
        console.error("Error loading 3D model:", error)
        setError("Failed to load 3D model")
        setLoading(false)
      },
    )

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [modelUrl])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="h-10 w-10 text-[#e94d97] animate-spin" />
            <span className="ml-2 text-lg font-medium">Loading 3D model...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>

      {/* Floating specs */}
      <div className="absolute top-4 right-4 space-y-2">
        {specs.map((spec, index) => (
          <div
            key={index}
            className={`bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg transition-all duration-300 cursor-pointer ${
              activeSpec === index ? "scale-110 bg-[#e94d97] text-white" : "hover:bg-[#e94d97]/10"
            }`}
            onClick={() => setActiveSpec(activeSpec === index ? null : index)}
          >
            <p className="font-medium">{spec.name}</p>
            {activeSpec === index && <p className="text-sm mt-1">{spec.value}</p>}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">Click and drag to rotate. Scroll to zoom.</div>
    </div>
  )
}
