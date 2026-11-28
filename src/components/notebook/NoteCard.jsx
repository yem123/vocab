import { Pencil, Trash2 } from "lucide-react";

const ruled = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, #ece6d6 27px, #ece6d6 28px)",
  backgroundSize: "100% 28px",
  lineHeight: "28px",
  width: "100%",
};

export default function NoteCard({ note, onEdit, onDelete }) {
  const iconBtn =
    "p-1.5 rounded-lg text-[#8a928e] hover:text-[#2c302e] hover:bg-[#f4f3ef] transition-colors";

  return (
    <div className="relative bg-[#fffdf5] border border-[#ece6d6] rounded-xl shadow-xs overflow-hidden">
      <div className="absolute left-7 top-0 bottom-0 w-px bg-[#efc3bb]" />

      <div className="relative flex justify-between pt-2.5 pb-1 pl-10 pr-6">
        <div style={ruled}>
          <p className="font-serif text-[15px] leading text-[#2c302e] whitespace-pre-wrap wrap-break">
            {note.text}
          </p>
          {note.translation && (
            <p className="font-sans text-xs leading text-[#637368] whitespace-pre-wrap wrap-break">
              {note.translation}
            </p>
          )}
        </div>

        <div className="absolute left-0 flex flex-col items-center shrink-0">
          <button
            type="button"
            onClick={() => onEdit(note.id)}
            title="Bearbeiten"
            className={iconBtn}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            title="Löschen"
            className={`${iconBtn} hover:text-rose-500`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
