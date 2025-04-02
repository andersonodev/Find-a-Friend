import { MapPin, Star } from "lucide-react";
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
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={avatar}
          alt={`Foto de perfil de ${name}`}
          className="w-full h-56 object-cover"
        />
        {verified && (
          <div className="absolute bottom-3 left-3 flex items-center">
            <Badge variant="verified" className="flex items-center gap-1 px-2 py-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verificado
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading font-bold text-lg text-neutral-800">
            {displayName}
          </h3>
          <div className="flex items-center">
            <div className="flex text-[#FFB400]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-neutral-600 text-xs ml-1">
              {reviewCount} avaliações
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-neutral-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
        <div className="mb-4">
          <p className="text-neutral-700 text-sm">{bio}</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {interests.map((interest) => (
            <Badge key={interest} variant="interest" className="px-2 py-1 rounded-full text-xs">
              {interest}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-neutral-800 font-semibold">
              R$ {hourlyRate}
            </span>
            <span className="text-neutral-600 text-sm"> / hora</span>
          </div>
          <Link href={`/amigos/${id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium text-sm py-2 px-4 rounded-md transition">
              Reservar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
