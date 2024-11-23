"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addHole, updateHole } from "./actions";
import { IHole } from "@/models/Hole";

const holeLayoutTypes = ["straight", "dogleg-left", "dogleg-right"] as const;
const fairwayWidths = ["narrow", "medium", "wide"] as const;
const greenSizes = ["small", "medium", "large"] as const;

const formSchema = z.object({
  number: z.number().min(1).max(18),
  par: z.number().min(3).max(6),
  handicapStroke: z.number().min(1).max(18),
  yardages: z.object({
    red: z.number().min(1),
    white: z.number().min(1),
    yellow: z.number().min(1),
    blue: z.number().min(1),
  }),
  waterHazards: z.object({
    left: z.boolean().default(false),
    right: z.boolean().default(false),
    front: z.boolean().default(false),
  }),
  bunkers: z.object({
    positions: z.array(z.string()),
    count: z.number().min(0),
  }),
  green: z.object({
    shape: z.string().min(1),
    size: z.enum(greenSizes),
  }),
  holeLayout: z.object({
    type: z.enum(holeLayoutTypes),
    fairwayWidth: z.enum(fairwayWidths),
  }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface HoleFormProps {
  hole?: IHole;
  onSuccess: (hole: IHole) => void;
}

// Helper function to convert IHole to FormData
const convertHoleToFormData = (hole: IHole): FormData => {
  return {
    number: hole.number,
    par: hole.par,
    handicapStroke: hole.handicapStroke,
    yardages: {
      red: hole.yardages.red,
      white: hole.yardages.white,
      yellow: hole.yardages.yellow,
      blue: hole.yardages.blue,
    },
    waterHazards: {
      left: hole.waterHazards.left,
      right: hole.waterHazards.right,
      front: hole.waterHazards.front,
    },
    bunkers: {
      positions: Array.isArray(hole.bunkers.positions)
        ? hole.bunkers.positions
        : typeof hole.bunkers.positions === "string"
        ? (hole.bunkers.positions as string).split(",").map((p) => p.trim())
        : [],
      count: hole.bunkers.count,
    },
    green: {
      shape: hole.green.shape,
      size: hole.green.size as (typeof greenSizes)[number],
    },
    holeLayout: {
      type: hole.holeLayout.type as (typeof holeLayoutTypes)[number],
      fairwayWidth: hole.holeLayout
        .fairwayWidth as (typeof fairwayWidths)[number],
    },
    description: hole.description,
    imageUrl: hole.imageUrl,
  };
};

export default function HoleForm({ hole, onSuccess }: HoleFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: hole
      ? convertHoleToFormData(hole)
      : {
          number: undefined,
          par: undefined,
          handicapStroke: undefined,
          yardages: {
            red: undefined,
            white: undefined,
            yellow: undefined,
            blue: undefined,
          },
          waterHazards: {
            left: false,
            right: false,
            front: false,
          },
          bunkers: {
            positions: [],
            count: 0,
          },
          green: {
            shape: "",
            size: "medium",
          },
          holeLayout: {
            type: "straight",
            fairwayWidth: "medium",
          },
          description: "",
          imageUrl: "",
        },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = hole
        ? await updateHole(hole._id, data)
        : await addHole(data);
      onSuccess(result);
    } catch (error) {
      console.error("Error submitting hole:", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hole Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="par"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Par</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="handicapStroke"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handicap Stroke</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Yardages */}
          <div className="space-y-4">
            <FormLabel>Yardages</FormLabel>
            <div className="space-y-4">
              {["red", "white", "yellow", "blue"].map((color) => (
                <FormField
                  key={color}
                  control={form.control}
                  name="yardages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{color} Tee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value[color as keyof typeof field.value]}
                          onChange={(e) =>
                            field.onChange({
                              ...field.value,
                              [color]: Number(e.target.value),
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Water Hazards */}
          <div className="space-y-4">
            <FormLabel>Water Hazards</FormLabel>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="waterHazards"
                render={({ field }) => (
                  <div className="space-y-2">
                    {["left", "right", "front"].map((position) => (
                      <FormItem
                        key={position}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={
                              field.value[position as keyof typeof field.value]
                            }
                            onCheckedChange={(checked) => {
                              field.onChange({
                                ...field.value,
                                [position]: checked,
                              });
                            }}
                          />
                        </FormControl>
                        <FormLabel className="capitalize">{position}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Bunkers */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bunkers.count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bunkers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bunkers.positions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bunker Positions</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="left, right, greenside (comma-separated)"
                      {...field}
                      value={
                        Array.isArray(field.value)
                          ? field.value.join(", ")
                          : field.value
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(",").map((p) => p.trim())
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Green */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="green.shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Green Shape</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., circular, oval" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="green.size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Green Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select green size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Hole Layout */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="holeLayout.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layout Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="straight">Straight</SelectItem>
                      <SelectItem value="dogleg-left">Dogleg Left</SelectItem>
                      <SelectItem value="dogleg-right">Dogleg Right</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holeLayout.fairwayWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fairway Width</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fairway width" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="narrow">Narrow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Hole description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Image URL for hole diagram"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {hole ? "Update Hole" : "Add Hole"}
        </Button>
      </form>
    </Form>
  );
}
