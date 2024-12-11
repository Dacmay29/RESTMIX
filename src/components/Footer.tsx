import React from 'react';
import { MapPin, Clock, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Footer: React.FC = () => {
  const config = useStore((state) => state.config);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-medium">Ubicación</h3>
            </div>
            <p className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
              <span>{config.address}</span>
            </p>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5" />
              <h3 className="text-lg font-medium">Horario</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Lunes a Domingo</p>
                  <p>{config.schedule.open} - {config.schedule.close}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm">
                  ¡Disfruta de nuestro servicio de entrega durante todo nuestro horario de atención!
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Phone className="h-5 w-5" />
              <h3 className="text-lg font-medium">Contacto</h3>
            </div>
            <div className="space-y-3">
              <a
                href={`tel:${config.phone}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>{config.phone}</span>
              </a>
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{config.whatsapp}</span>
              </a>
              {config.socialMedia && (
                <div className="flex items-center gap-4 mt-6">
                  {config.socialMedia.instagram && (
                    <a
                      href={config.socialMedia.instagram}
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {config.socialMedia.facebook && (
                    <a
                      href={config.socialMedia.facebook}
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  )}
                  {config.socialMedia.twitter && (
                    <a
                      href={config.socialMedia.twitter}
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright and Credits */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-sm">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} {config.name}. Todos los derechos reservados.
            </div>
            <div className="text-center">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Políticas de Privacidad
              </Link>
            </div>
            <div className="text-center md:text-right">
              <span className="text-gray-400">Creado por </span>
              <a
                href="https://github.com/davidcmay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                David CMay
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};