"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@strait/ui/components/menubar";
import { useState } from "react";

export default function MenubarWithCheckboxRadioDemo() {
  const [showRuler, setShowRuler] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState("100");

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Show</MenubarLabel>
          <MenubarCheckboxItem
            checked={showRuler}
            onCheckedChange={(v) => setShowRuler(!!v)}
          >
            Ruler
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={showGrid}
            onCheckedChange={(v) => setShowGrid(!!v)}
          >
            Grid
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Zoom</MenubarLabel>
          <MenubarRadioGroup
            onValueChange={(v) => setZoom(v ?? zoom)}
            value={zoom}
          >
            {["50", "75", "100", "150", "200"].map((level) => (
              <MenubarRadioItem key={level} value={level}>
                {level}%
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
