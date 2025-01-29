import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, FileText, Cpu } from "lucide-react";

export default function BoardSelect() {
    return (
      <Card className="w-full h-full border-senseboxGreen flex flex-col">
        <CardHeader className="bg-senseboxGreen text-white p-4 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-6 h-6" />
            <CardTitle>Sketch hochladen!</CardTitle>
          </div>
          <CardDescription className="text-senseboxYellow">
            Lade einen Sketch auf die MCU-S2 hoch
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col">
          <form className="flex-1 flex flex-col gap-4 ">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sketch" className="text-senseboxGreen flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Sketch auswählen</span>
              </Label>
              <Select>
                <SelectTrigger id="sketch">
                  <SelectValue placeholder="Sketch auswählen" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="ota">Over-the-Air (OTA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="boardSelect" className="text-senseboxGreen flex items-center space-x-2">
                <Cpu className="w-5 h-5" />
                <span>Board auswählen</span>
              </Label>
              <Select>
                <SelectTrigger id="boardSelect">
                  <SelectValue placeholder="Board" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="mcu-s2">MCU-S2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="p-4 mt-auto">
          <Button className="w-full bg-senseboxGreen text-white hover:bg-senseboxGreen/80">
            Hochladen
          </Button>
        </CardFooter>
      </Card>
    );
  }
  