import React, { ChangeEventHandler, FormEventHandler } from "react";
import Loading from "./Loading";
import Button from "./Button";
import { IoLogoYoutube } from "react-icons/io5";
interface FormProps {
  onSearch: FormEventHandler<HTMLFormElement>; // Handler untuk event form submit
  isSearching: boolean; // Status pencarian
  videoUrlError: boolean; // Status error URL video
  videoUrl: string; // URL video
  onChangeInput: ChangeEventHandler<HTMLInputElement>; // Handler untuk perubahan input
}

export default function Form({
  onSearch,
  isSearching,
  videoUrlError,
  videoUrl,
  onChangeInput,
}: FormProps) {
  return (
    <form onSubmit={onSearch} className="relative flex items-center ">
      <input
        type="text"
        placeholder="Paste Video URL or ID here"
        disabled={isSearching}
        maxLength={255}
        className={`w-full py-2 pl-10 pr-3 border ${
          videoUrlError ? "border-red-500" : "border-gray-300"
        } rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60`}
        value={videoUrl}
        onChange={onChangeInput}
      />
      <div className="absolute left-0 pl-3">
      <IoLogoYoutube className="text-lg text-red-500" />

      </div>
      <Button
        variant="danger"
        className={`ml-3 `}
        classNameText="whitespace-nowrap"
        withoutLineClamp
        type="submit"
        disabled={isSearching}
        icon={isSearching && <Loading className="mr-1" fullscreen={false} />}
      >
        Search
      </Button>
     
    </form>
  );
}
