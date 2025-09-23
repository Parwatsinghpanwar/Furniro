import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface ExamSession {
  id: string;
  studentName: string;
  examTitle: string;
  startTime: Date;
  status: 'active' | 'completed' | 'flagged';
  alertCount: number;
  duration: number;
}

interface SystemAlert {
  id: string;
  sessionId: string;
  studentName: string;
  type: 'person' | 'voice' | 'pose' | 'tab-switch';
  severity: 'warning' | 'critical';
  message: string;
  timestamp: Date;
}

const AdminDashboard = () => {
  const [sessions] = useState<ExamSession[]>([
    {
      id: '1',
      studentName: 'John Doe',
      examTitle: 'Mathematics Final',
      startTime: new Date(Date.now() - 1800000), // 30 mins ago
      status: 'active',
      alertCount: 3,
      duration: 30
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      examTitle: 'Physics Midterm',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'flagged',
      alertCount: 8,
      duration: 60
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      examTitle: 'Chemistry Quiz',
      startTime: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'completed',
      alertCount: 1,
      duration: 90
    }
  ]);

  const [systemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      sessionId: '2',
      studentName: 'Jane Smith',
      type: 'tab-switch',
      severity: 'critical',
      message: 'Multiple tab switches detected',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      sessionId: '1',
      studentName: 'John Doe',
      type: 'voice',
      severity: 'warning',
      message: 'Voice activity detected',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: '3',
      sessionId: '2',
      studentName: 'Jane Smith',
      type: 'person',
      severity: 'critical',
      message: 'No person detected in frame',
      timestamp: new Date(Date.now() - 900000)
    }
  ]);

  const getStatusBadge = (status: ExamSession['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'person':
        return <Users className="w-4 h-4" />;
      case 'voice':
        return <Monitor className="w-4 h-4" />;
      case 'pose':
        return <Eye className="w-4 h-4" />;
      case 'tab-switch':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {sessions.filter(s => s.status === 'active').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Flagged Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {sessions.filter(s => s.status === 'flagged').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sessions.filter(s => s.status === 'completed').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Total Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {systemAlerts.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Sessions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{session.studentName}</h3>
                            <p className="text-sm text-muted-foreground">{session.examTitle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(session.status)}
                            {session.alertCount > 0 && (
                              <Badge variant="destructive">{session.alertCount} alerts</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Started: {session.startTime.toLocaleTimeString()}</span>
                          <span>Duration: {formatDuration(session.duration)}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Live
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Recording
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {systemAlerts.map((alert) => (
                      <Alert key={alert.id} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                        {getAlertIcon(alert.type)}
                        <AlertDescription className="text-xs">
                          <div className="font-medium">{alert.studentName}</div>
                          <div className="mb-1">{alert.message}</div>
                          <div className="text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">AI Detection Service</div>
                    <div className="text-sm text-muted-foreground">Online</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Recording Storage</div>
                    <div className="text-sm text-muted-foreground">Available (85% capacity)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Database</div>
                    <div className="text-sm text-muted-foreground">Connected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;