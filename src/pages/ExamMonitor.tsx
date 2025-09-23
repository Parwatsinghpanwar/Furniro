import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, Monitor, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface DetectionAlert {
  id: string;
  type: 'person' | 'voice' | 'pose' | 'tab-switch';
  severity: 'warning' | 'critical';
  message: string;
  timestamp: Date;
}

const ExamMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<DetectionAlert[]>([]);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  const [screenRecording, setScreenRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [detectionStatus, setDetectionStatus] = useState({
    personDetected: true,
    voiceLevel: 0,
    suspiciousMovement: false,
    tabSwitches: 0
  });

  const addAlert = (type: DetectionAlert['type'], severity: DetectionAlert['severity'], message: string) => {
    const newAlert: DetectionAlert = {
      id: Date.now().toString(),
      type,
      severity,
      message,
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep last 10 alerts
  };

  const requestPermissions = async () => {
    try {
      // Camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraPermission(true);
      setMicPermission(true);
      
      // Simulate voice detection
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkVoiceLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setDetectionStatus(prev => ({ ...prev, voiceLevel: average }));
        
        if (average > 50) {
          addAlert('voice', 'warning', 'Voice detected during exam');
        }
        
        if (isMonitoring) {
          requestAnimationFrame(checkVoiceLevel);
        }
      };
      
      checkVoiceLevel();
      
    } catch (error) {
      console.error('Permission denied:', error);
      addAlert('person', 'critical', 'Camera/microphone access denied');
    }
  };

  const startScreenRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      
      mediaRecorderRef.current = new MediaRecorder(displayStream);
      mediaRecorderRef.current.start();
      setScreenRecording(true);
      
      displayStream.getVideoTracks()[0].onended = () => {
        setScreenRecording(false);
        addAlert('tab-switch', 'critical', 'Screen sharing stopped - possible tab switch');
      };
      
    } catch (error) {
      console.error('Screen recording failed:', error);
      addAlert('tab-switch', 'critical', 'Screen recording permission denied');
    }
  };

  const startMonitoring = async () => {
    await requestPermissions();
    await startScreenRecording();
    setIsMonitoring(true);
    
    // Simulate random detections for demo
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setDetectionStatus(prev => ({
          ...prev,
          suspiciousMovement: !prev.suspiciousMovement
        }));
        
        if (detectionStatus.suspiciousMovement) {
          addAlert('pose', 'warning', 'Suspicious head movement detected');
        }
      }
      
      if (Math.random() > 0.9) {
        setDetectionStatus(prev => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1
        }));
        addAlert('tab-switch', 'critical', 'Tab switch detected');
      }
    }, 3000);
    
    return () => clearInterval(interval);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setScreenRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isMonitoring) {
        addAlert('tab-switch', 'critical', 'Tab switched or window minimized');
        setDetectionStatus(prev => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMonitoring]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Exam Monitor System</h1>
            <div className="flex gap-2">
              {isMonitoring ? (
                <Button onClick={stopMonitoring} variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Stop Monitoring
                </Button>
              ) : (
                <Button onClick={startMonitoring} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Monitoring
                </Button>
              )}
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={cameraPermission ? "default" : "destructive"}>
                    {cameraPermission ? "Active" : "Inactive"}
                  </Badge>
                  {detectionStatus.personDetected && (
                    <Badge variant="outline">Person Detected</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Voice Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={micPermission ? "default" : "destructive"}>
                    {micPermission ? "Listening" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Level: {Math.round(detectionStatus.voiceLevel)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Screen Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={screenRecording ? "default" : "destructive"}>
                    {screenRecording ? "Recording" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Switches: {detectionStatus.tabSwitches}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={alerts.length > 0 ? "destructive" : "default"}>
                    {alerts.length} Active
                  </Badge>
                  {detectionStatus.suspiciousMovement && (
                    <Badge variant="destructive">Suspicious</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera Feed */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Live Camera Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-64 object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    {isMonitoring && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="destructive" className="animate-pulse">
                          ● REC
                        </Badge>
                      </div>
                    )}
                    {detectionStatus.suspiciousMovement && (
                      <div className="absolute bottom-2 left-2">
                        <Alert className="w-fit">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>Suspicious movement detected</AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No alerts yet</p>
                    ) : (
                      alerts.map((alert) => (
                        <Alert key={alert.id} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-muted-foreground">
                              {alert.timestamp.toLocaleTimeString()}
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>System Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Before Starting Exam:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Click "Start Monitoring" to begin</li>
                    <li>• Grant camera and microphone permissions</li>
                    <li>• Allow screen sharing for recording</li>
                    <li>• Ensure good lighting for face detection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">During Exam:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Stay within camera frame at all times</li>
                    <li>• Avoid excessive head movements</li>
                    <li>• Do not switch tabs or minimize window</li>
                    <li>• Keep noise to minimum level</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamMonitor;