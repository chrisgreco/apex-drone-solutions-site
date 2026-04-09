'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DroneVisualization3DProps = {
	className?: string;
	autoRotate?: boolean;
	size?: 'sm' | 'md' | 'lg';
};

export function DroneVisualization3D({
	className,
	autoRotate = true,
	size = 'lg',
}: DroneVisualization3DProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mouseRef = useRef({ x: 0, y: 0 });
	const targetRotRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		if (!containerRef.current) return;
		const container = containerRef.current;

		const geometries: THREE.BufferGeometry[] = [];
		const materials: THREE.Material[] = [];
		const propGroups: THREE.Group[] = [];

		// Scene
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			50,
			container.clientWidth / container.clientHeight,
			0.1,
			100,
		);
		camera.position.set(0, 0.5, size === 'sm' ? 7.5 : 6);

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.1;
		container.appendChild(renderer.domElement);

		// Lights
		const ambient = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambient);

		const key = new THREE.DirectionalLight(0xffffff, 2.0);
		key.position.set(3, 5, 4);
		scene.add(key);

		const fill = new THREE.DirectionalLight(0x8899bb, 0.8);
		fill.position.set(-3, 2, -2);
		scene.add(fill);

		const accent = new THREE.PointLight(0x4CAF50, 4, 12);
		accent.position.set(0, -1, 3);
		scene.add(accent);

		const rim = new THREE.PointLight(0x4CAF50, 2, 10);
		rim.position.set(-2, 1, -3);
		scene.add(rim);

		const ground = new THREE.PointLight(0x4ade80, 1.5, 8);
		ground.position.set(0, -3, 0);
		scene.add(ground);

		// Groups
		const sceneGroup = new THREE.Group();
		const droneGroup = new THREE.Group();
		sceneGroup.add(droneGroup);
		scene.add(sceneGroup);

		// Helper: create mesh and track for disposal
		function makeMesh(
			geo: THREE.BufferGeometry,
			mat: THREE.MeshStandardMaterial,
		): THREE.Mesh {
			geometries.push(geo);
			materials.push(mat);
			return new THREE.Mesh(geo, mat);
		}

		// Materials
		const bodyMat = new THREE.MeshStandardMaterial({
			color: 0x0F2419,
			metalness: 0.7,
			roughness: 0.2,
		});
		const armMat = new THREE.MeshStandardMaterial({
			color: 0x1B3A2D,
			metalness: 0.5,
			roughness: 0.3,
		});
		const motorMat = new THREE.MeshStandardMaterial({
			color: 0x4CAF50,
			metalness: 0.6,
			roughness: 0.2,
			emissive: 0x4CAF50,
			emissiveIntensity: 0.4,
		});
		const propMat = new THREE.MeshStandardMaterial({
			color: 0x4CAF50,
			metalness: 0.3,
			roughness: 0.5,
			transparent: true,
			opacity: 0.5,
			emissive: 0x4CAF50,
			emissiveIntensity: 0.1,
		});
		const gimbalMat = new THREE.MeshStandardMaterial({
			color: 0x0F2419,
			metalness: 0.8,
			roughness: 0.1,
		});
		const lensMat = new THREE.MeshStandardMaterial({
			color: 0x4CAF50,
			metalness: 0.9,
			roughness: 0.05,
			emissive: 0x4CAF50,
			emissiveIntensity: 0.6,
		});
		materials.push(bodyMat, armMat, motorMat, propMat, gimbalMat, lensMat);

		// Body
		const bodyGeo = new THREE.BoxGeometry(1.2, 0.28, 0.7);
		const body = makeMesh(bodyGeo, bodyMat);
		droneGroup.add(body);

		// Battery ridge
		const capGeo = new THREE.BoxGeometry(0.7, 0.1, 0.45);
		const cap = makeMesh(capGeo, bodyMat);
		cap.position.y = 0.19;
		droneGroup.add(cap);

		// Front indicator LED
		const ledGeo = new THREE.SphereGeometry(0.03, 6, 4);
		const ledMat = new THREE.MeshStandardMaterial({
			color: 0x4CAF50,
			emissive: 0x4CAF50,
			emissiveIntensity: 2,
		});
		materials.push(ledMat);
		const led = makeMesh(ledGeo, ledMat);
		led.position.set(0, 0.06, -0.36);
		droneGroup.add(led);

		// Arms + motors + propellers
		const armPositions = [
			{ angle: Math.PI * 0.25, x: 0.95, z: -0.95 },
			{ angle: -Math.PI * 0.25, x: -0.95, z: -0.95 },
			{ angle: Math.PI * 0.75, x: 0.95, z: 0.95 },
			{ angle: -Math.PI * 0.75, x: -0.95, z: 0.95 },
		];

		armPositions.forEach((ap) => {
			// Arm
			const armGeo = new THREE.BoxGeometry(1.6, 0.07, 0.1);
			const arm = makeMesh(armGeo, armMat);
			arm.rotation.y = ap.angle;
			droneGroup.add(arm);

			// Motor mount
			const mountGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.12, 8);
			const mount = makeMesh(mountGeo, motorMat);
			mount.position.set(ap.x, 0.06, ap.z);
			droneGroup.add(mount);

			// Propeller group
			const propGroup = new THREE.Group();
			propGroup.position.set(ap.x, 0.14, ap.z);

			for (let b = 0; b < 2; b++) {
				const bladeGeo = new THREE.BoxGeometry(0.75, 0.012, 0.1);
				const blade = makeMesh(bladeGeo, propMat);
				blade.rotation.y = (b * Math.PI) / 2;
				propGroup.add(blade);
			}

			droneGroup.add(propGroup);
			propGroups.push(propGroup);
		});

		// Gimbal
		const gimbalGeo = new THREE.SphereGeometry(0.1, 8, 6);
		const gimbal = makeMesh(gimbalGeo, gimbalMat);
		gimbal.position.set(0, -0.22, 0.1);
		droneGroup.add(gimbal);

		const lensGeo = new THREE.SphereGeometry(0.055, 6, 5);
		const lens = makeMesh(lensGeo, lensMat);
		lens.position.set(0, -0.22, 0.18);
		droneGroup.add(lens);

		// Scan beam (green cone beneath drone)
		const beamGeo = new THREE.ConeGeometry(1.2, 2.5, 32, 1, true);
		const beamMat = new THREE.MeshBasicMaterial({
			color: 0x4ade80,
			transparent: true,
			opacity: 0.06,
			side: THREE.DoubleSide,
			depthWrite: false,
		});
		materials.push(beamMat);
		geometries.push(beamGeo);
		const beam = new THREE.Mesh(beamGeo, beamMat);
		beam.position.y = -1.6;
		beam.rotation.x = Math.PI;
		droneGroup.add(beam);

		// Glow ring around drone
		const ringGeo = new THREE.RingGeometry(1.8, 1.85, 64);
		const ringMat = new THREE.MeshBasicMaterial({
			color: 0x4CAF50,
			transparent: true,
			opacity: 0.15,
			side: THREE.DoubleSide,
			depthWrite: false,
		});
		materials.push(ringMat);
		geometries.push(ringGeo);
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.rotation.x = -Math.PI / 2;
		ring.position.y = -0.05;
		droneGroup.add(ring);

		// LED strip accents on body edges
		const stripGeo = new THREE.BoxGeometry(1.22, 0.015, 0.015);
		const stripMat = new THREE.MeshBasicMaterial({
			color: 0x4CAF50,
			transparent: true,
			opacity: 0.8,
		});
		materials.push(stripMat);
		geometries.push(stripGeo);
		const strip1 = new THREE.Mesh(stripGeo, stripMat);
		strip1.position.set(0, -0.14, 0.35);
		droneGroup.add(strip1);
		const strip2 = new THREE.Mesh(stripGeo, stripMat.clone());
		strip2.position.set(0, -0.14, -0.35);
		droneGroup.add(strip2);

		// Tilt drone slightly for a more dynamic default angle
		droneGroup.rotation.x = -0.1;
		droneGroup.rotation.y = 0.3;

		// Animation
		const clock = new THREE.Clock();
		let animationId = 0;

		const animate = () => {
			animationId = requestAnimationFrame(animate);
			const t = clock.getElapsedTime();

			// Propeller spin
			propGroups.forEach((prop, i) => {
				const dir = i % 2 === 0 ? 1 : -1;
				prop.rotation.y += 0.35 * dir;
			});

			// Hover float
			droneGroup.position.y = Math.sin(t * 1.2) * 0.08;
			droneGroup.rotation.z = Math.sin(t * 0.8) * 0.025;

			// Pulse scan beam and ring
			beamMat.opacity = 0.04 + Math.sin(t * 2) * 0.03;
			ringMat.opacity = 0.08 + Math.sin(t * 1.5) * 0.08;
			ring.rotation.z = t * 0.3;

			// LED pulse
			(ledMat as THREE.MeshStandardMaterial).emissiveIntensity = 1 + Math.sin(t * 4) * 1;

			// Mouse parallax
			targetRotRef.current.x +=
				(mouseRef.current.y * 0.3 - targetRotRef.current.x) * 0.05;
			targetRotRef.current.y +=
				(mouseRef.current.x * 0.4 - targetRotRef.current.y) * 0.05;
			sceneGroup.rotation.x = targetRotRef.current.x;
			sceneGroup.rotation.y = targetRotRef.current.y;

			// Auto rotate
			if (autoRotate) {
				sceneGroup.rotation.y += 0.003;
			}

			renderer.render(scene, camera);
		};

		// Mouse handler
		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			mouseRef.current = {
				x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
				y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
			};
		};

		const handleResize = () => {
			if (!container) return;
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('resize', handleResize);
		animate();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
			geometries.forEach((g) => g.dispose());
			materials.forEach((m) => m.dispose());
			renderer.dispose();
			if (container && renderer.domElement.parentNode === container) {
				container.removeChild(renderer.domElement);
			}
		};
	}, [autoRotate, size]);

	return <div ref={containerRef} className={cn('relative', className)} />;
}
