import { MapPin, Star, Clock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface FriendCardProps {
  id: number;
  name: string;
  age?: number;
  location: string;
  bio: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  interests: string[];
  hourlyRate: number;
}

export default function FriendCard({
  id,
  name,
  age,
  location,
  bio,
  avatar,
  verified,
  rating,
  reviewCount,
  interests,
  hourlyRate,
}: FriendCardProps) {
  const displayName = age ? `${name}, ${age}` : name;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
      <div className="relative">
        <img
          src={avatar}
          alt={`Foto de perfil de ${name}`}
          className="w-full h-56 object-cover"
        />
        {verified && (
          <div className="absolute bottom-3 left-3 flex items-center">
            <Badge variant="verified" className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Check className="h-3 w-3 mr-1" />
              Verificado
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-primary font-medium text-xs shadow-sm">
            <Star className="h-3 w-3 text-[#FFB400]" fill="#FFB400" />
            {rating.toFixed(1)}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-bold text-xl text-neutral-800">
            {displayName}
          </h3>
          <div className="text-[#FFB400] text-xs bg-amber-50 px-2 py-1 rounded-md flex items-center">
            <Star className="h-3 w-3 mr-1" fill="currentColor" />
            {reviewCount} avaliações
          </div>
        </div>
        <div className="flex items-center text-sm text-neutral-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-primary" />
          {location}
        </div>
        <div className="mb-4">
          <p className="text-neutral-700 text-sm line-clamp-2">{bio}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="interest" className="px-2 py-1 rounded-full text-xs bg-primary/5 text-primary border-primary/10">
              {interest}
            </Badge>
          ))}
          {interests.length > 3 && (
            <Badge variant="interest" className="px-2 py-1 rounded-full text-xs bg-neutral-100 text-neutral-600">
              +{interests.length - 3} mais
            </Badge>
          )}
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-primary mr-1.5" />
            <span className="text-neutral-800 font-semibold">
              R$ {hourlyRate}
            </span>
            <span className="text-neutral-600 text-sm"> / hora</span>
          </div>
          <Link href={`/amigos/${id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium text-sm py-2 px-4 rounded-lg transition shadow-sm hover:shadow">
              Reservar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}