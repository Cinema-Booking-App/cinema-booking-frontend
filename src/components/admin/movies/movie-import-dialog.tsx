"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileJson, AlertCircle, CheckCircle2, Download } from "lucide-react";
import { useImportMoviesMutation } from "@/store/slices/movies/moviesApi";
import { CreateMovies } from "@/types/movies";
import { toast } from "sonner";

export default function MovieImportDialog() {
  const [open, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [importMovies, { isLoading }] = useImportMoviesMutation();
  const [result, setResult] = useState<any>(null);

  const exampleData = {
    movies: [
      {
        title: "Avengers: Endgame",
        genre: "Action, Adventure, Drama",
        duration: 181,
        age_rating: "C13",
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins.",
        release_date: "2019-04-26",
        trailer_url: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
        poster_url: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        status: "ended",
        director: "Anthony Russo, Joe Russo",
        actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo"
      },
      {
        title: "Spider-Man: No Way Home",
        genre: "Action, Adventure, Fantasy",
        duration: 148,
        age_rating: "C13",
        description: "Peter Parker's secret identity is revealed to the entire world.",
        release_date: "2021-12-17",
        trailer_url: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
        poster_url: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        status: "now_showing",
        director: "Jon Watts",
        actors: "Tom Holland, Zendaya, Benedict Cumberbatch"
      }
    ]
  };

  const handleDownloadTemplate = () => {
    const dataStr = JSON.stringify(exampleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "movies-import-template.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Đã tải xuống file mẫu");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonData(content);
        toast.success(`Đã tải file: ${file.name}`);
      };
      reader.onerror = () => {
        toast.error("Lỗi khi đọc file");
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    try {
      // Parse JSON data
      const parsedData = JSON.parse(jsonData);
      
      // Validate structure
      if (!parsedData.movies || !Array.isArray(parsedData.movies)) {
        toast.error("Định dạng JSON không hợp lệ. Cần có trường 'movies' là một mảng.");
        return;
      }

      // Call API
      const response = await importMovies({ movies: parsedData.movies }).unwrap();
      
      setResult(response);
      
      if (response.success > 0) {
        toast.success(`Import thành công ${response.success}/${response.total} phim`);
      }
      
      if (response.failed > 0) {
        toast.warning(`${response.failed} phim import thất bại`);
      }

      // Clear data and reload page after 2 seconds
      setTimeout(() => {
        setJsonData("");
        setResult(null);
        setOpen(false);
        // Reload để cập nhật danh sách phim
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      console.error("Import error:", error);
      console.error("Error detail:", error?.data);
      if (error instanceof SyntaxError) {
        toast.error("Lỗi: JSON không hợp lệ");
      } else if (error?.status === 422) {
        // Hiển thị chi tiết lỗi validation từ backend
        const detail = error?.data?.detail;
        if (Array.isArray(detail)) {
          detail.forEach((err: any) => {
            toast.error(`${err.loc?.join(' > ')}: ${err.msg}`);
          });
        } else {
          toast.error(detail || "Dữ liệu không hợp lệ");
        }
      } else {
        toast.error(error?.data?.detail || "Có lỗi xảy ra khi import phim");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Import phim
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Import nhiều phim từ JSON</DialogTitle>
          <DialogDescription className="text-sm">
            Tải lên file JSON hoặc dán nội dung JSON để import nhiều phim cùng lúc
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
            <FileJson className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700">Chọn file JSON</span>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">hoặc dán nội dung JSON bên dưới</p>
          </div>

          {/* JSON Textarea */}
          <div>
            <label className="block text-sm font-medium mb-2">Nội dung JSON:</label>
            <textarea
              className="w-full h-48 sm:h-64 p-2 sm:p-3 border border-gray-300 dark:border-gray-700 rounded-md font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 resize-none"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder='{"movies": [{"title": "Tên phim", "duration": 120, ...}]}'
            />
            {jsonData && (() => {
              try {
                const parsed = JSON.parse(jsonData);
                const count = parsed.movies?.length || 0;
                return (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Đã load {count} phim
                  </p>
                );
              } catch {
                return (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠ JSON không hợp lệ
                  </p>
                );
              }
            })()}
          </div>

          {/* Download Template */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">Cần file mẫu?</h4>
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Tải xuống file JSON mẫu để xem cấu trúc dữ liệu
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTemplate}
                className="gap-2 bg-white dark:bg-gray-800"
              >
                <Download className="w-4 h-4" />
                Tải file mẫu
              </Button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  Import thành công: {result.success}/{result.total}
                </span>
              </div>
              
              {result.failed > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Thất bại: {result.failed}</span>
                </div>
              )}

              {result.failed_movies && result.failed_movies.length > 0 && (
                <div className="mt-2 p-2 sm:p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="font-medium text-red-900 dark:text-red-100 mb-2 text-sm sm:text-base">Các phim thất bại:</p>
                  <ul className="text-xs sm:text-sm space-y-1 max-h-32 overflow-y-auto">
                    {result.failed_movies.map((movie: any, index: number) => (
                      <li key={index} className="text-red-800 dark:text-red-200 break-words">
                        • {movie.title}: {movie.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!jsonData || isLoading}
            className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
          >
            {isLoading ? "Đang import..." : "Import phim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
