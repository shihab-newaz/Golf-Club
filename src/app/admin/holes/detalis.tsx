// app/admin/holes/showmoredetailsdialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LandPlot,
  Ruler,
  Waves,
  CircleDot,
  LayoutGrid,
  ImageIcon,
} from "lucide-react";
import { IHole } from "@/models/Hole";

interface ShowMoreDetailsDialogProps {
  hole: IHole;
}

const ShowMoreDetailsDialog: React.FC<ShowMoreDetailsDialogProps> = ({
  hole,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <LandPlot className="h-6 w-6" />
            Hole {hole.number} Details
            <Badge variant="outline">Par {hole.par}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CircleDot className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Handicap Stroke:</span>{" "}
                  {hole.handicapStroke}
                </p>
                <p>
                  <span className="font-medium">Layout Type:</span>{" "}
                  {hole.holeLayout.type}
                </p>
                <p>
                  <span className="font-medium">Fairway Width:</span>{" "}
                  <Badge variant="outline">
                    {hole.holeLayout.fairwayWidth}
                  </Badge>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Yardages */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Yardages
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Badge className="bg-red-500">Red</Badge>
                    <span className="ml-2">{hole.yardages.red} yards</span>
                  </div>
                  <div>
                    <Badge className="bg-white text-black">White</Badge>
                    <span className="ml-2">{hole.yardages.white} yards</span>
                  </div>
                  <div>
                    <Badge className="bg-yellow-400">Yellow</Badge>
                    <span className="ml-2">{hole.yardages.yellow} yards</span>
                  </div>
                  <div>
                    <Badge className="bg-blue-500">Blue</Badge>
                    <span className="ml-2">{hole.yardages.blue} yards</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hazards */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Hazards
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Water Hazards:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: "left", label: "Left" },
                      { key: "right", label: "Right" },
                      { key: "front", label: "Front" },
                    ].map(
                      ({ key, label }) =>
                        hole.waterHazards[
                          key as keyof typeof hole.waterHazards
                        ] && (
                          <Badge key={key} variant="secondary">
                            {label}
                          </Badge>
                        )
                    )}
                    {!Object.values(hole.waterHazards).some(Boolean) && (
                      <span className="text-muted-foreground">
                        No water hazards
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    Bunkers ({hole.bunkers.count}):
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {hole.bunkers.positions.map((position, index) => (
                      <Badge key={index} variant="outline">
                        {position}
                      </Badge>
                    ))}
                    {hole.bunkers.positions.length === 0 && (
                      <span className="text-muted-foreground">
                        No bunker positions specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Green Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5" />
                Green Details
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Shape:</span> {hole.green.shape}
                </p>
                <p>
                  <span className="font-medium">Size:</span>{" "}
                  <Badge variant="outline">{hole.green.size}</Badge>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hole Image */}
          {hole.imageUrl && (
            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Hole Layout
                </h3>
                <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                  <img
                    src={hole.imageUrl}
                    alt={`Hole ${hole.number} layout`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowMoreDetailsDialog;
