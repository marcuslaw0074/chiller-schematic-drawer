"use client";
import React from "react";
import { useRef } from "react";

const DragAndDrop: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>) => {
    // Set the data being dragged (image source URL)
    event.dataTransfer.setData("text/plain", imageRef.current!.src);
    // Set the drag image to be a copy of the SVG image
    event.dataTransfer.setDragImage(imageRef.current!, 0, 0);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    // Prevent default behavior to allow dropping
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    // Prevent default behavior to avoid loading the dropped image in the browser
    event.preventDefault();
    // Get the dropped image source URL from the data transferred
    const imageUrl = event.dataTransfer.getData("text/plain");

    // Do something with the dropped image URL (e.g., display it)
    console.log("Dropped image URL:", imageUrl);
  };

  return (
    <div>
      <img
        ref={imageRef}
        src="chiller-water-off.svg"
        alt="SVG Image"
        draggable
        onDragStart={handleDragStart}
      />
      <div
        style={{ width: "400px", height: "400px", border: "1px solid black" }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        Dropzone
      </div>
    </div>
  );
};

export default DragAndDrop;
