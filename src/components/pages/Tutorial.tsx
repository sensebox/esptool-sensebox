import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import {
  Plug,
  Settings,
  Search,
  UploadCloud,
  Terminal,
  CheckCircle,
} from 'lucide-react';

const Tutorial: React.FC = () => {
  return (
    <Card className="flex flex-col border-2 border-slate-300 shadow-md bg-white">
      <CardHeader className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-2xl font-bold text-slate-800">Anleitung</h2>
        <CardDescription className="mt-1 text-lg text-slate-600">
          Schritt-für-Schritt Anleitung zur Verwendung des Terminals.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 ">
        <ol className="space-y-4 ">
          {/* Schritt 0: MCU-S2 anschließen */}
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Plug className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">MCU-S2 anschließen</p>
              <p className="text-sm text-slate-500">
                Schließe deine MCU-S2 an den PC an.
              </p>
            </div>
          </li>

          {/* Schritt 1: MCU-S2 in den Dev-Modus bringen */}
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Settings className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Dev-Modus aktivieren</p>
              <p className="text-sm text-slate-500">
                Halte den Switch-Button gedrückt und drücke einmal den Reset-Button, um die MCU-S2 in den Dev-Modus zu bringen.
              </p>
            </div>
          </li>

          {/* Schritt 2: Board auswählen und Verbindung herstellen */}
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Search className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Board auswählen</p>
              <p className="text-sm text-slate-500">
                Klicke auf den &#39;Board suchen&#39; Button, um dein Board auszuwählen und die Verbindung herzustellen.
              </p>
              <p className="text-sm text-slate-500">
              Dein Board sollte angefangen mit dem Namen &#39;ESP32-S2&#39; angezeigt werden. 
              </p>
            </div>
          </li>

          {/* Schritt 3: Sketch hochladen */}
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <UploadCloud className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Sketch hochladen</p>
              <p className="text-sm text-slate-500">
                Sobald das Board erkannt wurde, klicke auf &#39;Sketch hochladen!&#39;.
              </p>
            </div>
          </li>

          {/* Schritt 4: Terminal beobachten */}
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Terminal className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Terminal beobachten</p>
              <p className="text-sm text-slate-500">
                Beobachte das Terminal, um den Fortschritt und eventuelle Fehlermeldungen zu sehen.
              </p>
            </div>
          </li>

          {/* Schritt 5: Upload bestätigen */}
          <li className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Upload bestätigen</p>
              <p className="text-sm text-slate-500">
                Nach erfolgreichem Upload erscheint eine Erfolgsmeldung.
              </p>
            </div>
          </li>
        </ol>
      </CardContent>
    </Card>
  );
};

export default Tutorial;
