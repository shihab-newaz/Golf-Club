import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Hotel,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  Wifi,
  Tv,
  Coffee,
  Bath,
  Utensils,
  Phone,
  AirVent
} from 'lucide-react';

interface HotelRoom {
  _id: string;
  roomNumber: string;
  type: "standard" | "deluxe" | "suite";
  capacity: number;
  pricePerNight: number;
  amenities?: string[];
  isAvailable: boolean;
  description?: string;
}

interface HotelRoomDetailsDialogProps {
  room: HotelRoom;
}

const HotelRoomDetailsDialog: React.FC<HotelRoomDetailsDialogProps> = ({ room }) => {
  const [open, setOpen] = useState(false);

  // Get room type color
  const getRoomTypeColor = (type: HotelRoom['type']): string => {
    const typeColors: Record<HotelRoom['type'], string> = {
      standard: 'bg-blue-500',
      deluxe: 'bg-purple-500',
      suite: 'bg-amber-500'
    };
    return typeColors[type];
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const amenityIcons: Record<string, JSX.Element> = {
      'wifi': <Wifi className="h-4 w-4" />,
      'tv': <Tv className="h-4 w-4" />,
      'coffee maker': <Coffee className="h-4 w-4" />,
      'bathroom': <Bath className="h-4 w-4" />,
      'room service': <Utensils className="h-4 w-4" />,
      'phone': <Phone className="h-4 w-4" />,
      'air conditioning': <AirVent className="h-4 w-4" />
      // Add more amenity icons as needed
    };
    return amenityIcons[amenity.toLowerCase()] || null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          See Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Room {room.roomNumber}</span>
            <Badge className={`${getRoomTypeColor(room.type)} text-white`}>
              {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Room Information</h3>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <Hotel className="h-4 w-4" />
                  <span className="font-medium">Room Number:</span> {room.roomNumber}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Capacity:</span> {room.capacity} {room.capacity > 1 ? 'persons' : 'person'}
                </p>
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Price:</span> ${room.pricePerNight.toLocaleString()}/night
                </p>
                <p className="flex items-center gap-2">
                  {room.isAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">Status:</span>
                  <span className={room.isAvailable ? 'text-green-500' : 'text-red-500'}>
                    {room.isAvailable ? 'Available' : 'Occupied'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {room.description && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-muted-foreground">{room.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Room Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelRoomDetailsDialog;