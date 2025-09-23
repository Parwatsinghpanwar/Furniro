import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Monitor, Users, ShoppingBag } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">ExamGuard</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/exam">
              <Button variant={isActive('/') || isActive('/exam') ? 'default' : 'outline'} size="sm">
                <Monitor className="w-4 h-4 mr-2" />
                Exam Monitor
              </Button>
            </Link>
            
            <Link to="/admin">
              <Button variant={isActive('/admin') ? 'default' : 'outline'} size="sm">
                <Users className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
            
            <Link to="/shop">
              <Button variant={isActive('/shop') ? 'default' : 'outline'} size="sm">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop (Demo)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;