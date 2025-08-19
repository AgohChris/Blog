
import React from 'react';
import { Heart, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Code className="h-4 w-4" />
            <span className="text-sm">MiniBlog - Plateforme de blogging moderne</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span className="text-sm">Fait avec</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm">et React</span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 MiniBlog. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
