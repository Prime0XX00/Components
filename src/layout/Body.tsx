import Input from "../components/Input";
import Button from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import Popover, { type PopoverRef } from "../components/Popover";
import Select from "../components/Select";
import MultiSelect from "../components/MultiSelect";
import { DatePicker } from "../components/DatePicker";
import { DateRangePicker } from "../components/DateRangePicker";
import DataTable, { Direction } from "../components/DataTable/DataTable";
import { transformDateString } from "../helpers/transformers";
import { BooleanIconRenderer } from "../helpers/renderers";
import { tableData1 } from "../data/tabledata";
import { LuEllipsisVertical, LuHouse } from "react-icons/lu";
import { Tooltip } from "../components/Tooltip";
import { useRef } from "react";
import ContentWrapper from "../components/ContentWrapper";

const Body = () => {
	const closePopoverRef = useRef<PopoverRef>(null);

	return (
		<div className="h-full pb-20">
			<ContentWrapper>
				<section
					id="intro"
					className={`flex gap-x-10 py-20`}
				>
					<div className="max-w-full w-full">
						<h2>Einleitung</h2>
						<p>
							Dies ist eine Ansammlung von selbstentwickelten
							Komponenten, die mir bei einer schnellen
							Frontendentwicklung helfen.
							<br></br>
							<br></br>
							Ich habe mich etwas von der Bibliothek von Shadcn
							inspirieren lassen.
							<br></br>
							Beim Entwickeln der Komponenten habe ich ein gutes
							Verständnis von React aufgebaut und viele Techniken
							verinnerlicht.
							<br></br>
							<br></br>
							Die Bibliothek umfasst acht Komponenten, welche
							aufeinander aufbauen und ein simples, homogenes
							Design haben.
						</p>
					</div>
				</section>

				<section
					id="components"
					className="flex flex-col gap-y-10"
				>
					<section id="input">
						<h2>Input</h2>
						<p>
							Zeigt ein Inputfeld an, welches das
							Standard-Inputfeld mit anderen Styles nutzt.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
							<ShowField title="Standard">
								<Input></Input>
							</ShowField>
							<ShowField title="Mit Platzhalter">
								<Input placeholder="Eingabe..."></Input>
							</ShowField>
						</div>
						<ShowField title="Deaktiviert">
							<Input
								disabled
								placeholder="Eingabe..."
							></Input>
						</ShowField>
					</section>

					<section id="button">
						<h2>Button</h2>
						<p>
							Zeigt ein Button an, welcher den Standard-Button mit
							anderen Styles nutzt.
							<br></br>
							Der Button wird für weitere Komponenten als Basis
							verwendet.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
							<ShowField title="Standard">
								<Button>Button</Button>
							</ShowField>
							<ShowField title="Mit Icon">
								<Button className="flex items-center justify-center space-x-2">
									<span>Button</span>
									<LuHouse />
								</Button>
							</ShowField>
						</div>
						<ShowField title="Deaktiviert">
							<Button disabled>Button</Button>
						</ShowField>
					</section>

					<section id="checkbox">
						<h2>Checkbox</h2>
						<p>
							Zeigt einen Slider an, welcher einen Boolean-Zustand
							verwaltet.
							<br></br>
							Nutzt den Button als Basis.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
							<ShowField title="Standard">
								<Checkbox></Checkbox>
							</ShowField>
							<ShowField title="Eingegebener Zustand">
								<Checkbox selected={true}></Checkbox>
							</ShowField>
						</div>
						<ShowField title="Deaktiviert">
							<Checkbox
								selected={true}
								disabled
							></Checkbox>
						</ShowField>
					</section>

					<section id="tooltip">
						<h2>Tooltip</h2>
						<p>
							Zeigt Hilfestellungen oder Informationen an und kann
							an jegliche Elemente gebunden werden.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
							<ShowField title="Standard">
								<Tooltip content="Tooltip ist oben positioniert">
									<Button>Button</Button>
								</Tooltip>
							</ShowField>
							<ShowField title="Tooltip unten">
								<Tooltip
									position="b"
									content="Tooltip ist unten positioniert"
								>
									<Button>Button</Button>
								</Tooltip>
							</ShowField>
							<ShowField title="Tooltip links">
								<Tooltip
									position="l"
									content="Tooltip ist links positioniert"
								>
									<Button>Button</Button>
								</Tooltip>
							</ShowField>
							<ShowField title="Tooltip rechts">
								<Tooltip
									position="r"
									content="Tooltip ist rechts positioniert"
								>
									<Button>Button</Button>
								</Tooltip>
							</ShowField>
						</div>
						<ShowField title="Deaktiviert">
							<Tooltip
								position="r"
								content="Tooltip"
							>
								<Button disabled>Button</Button>
							</Tooltip>
						</ShowField>
					</section>

					<section id="popover">
						<h2>Popover</h2>
						<p>
							Zeigt einen aufklappbares Feld an, mit dem
							interagiert werden kann.
							<br></br>
							Das Popover kann vertikal positioniert und
							horizontal angeordnet werden.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
							<ShowField title="Standard">
								<Popover trigger={<Button>Button</Button>}>
									Popover ist unten links angeordnet
								</Popover>
							</ShowField>
							<ShowField title="Popover unten rechts">
								<Popover
									align="r"
									trigger={<Button>Button</Button>}
								>
									Popover ist unten rechts angeordnet
								</Popover>
							</ShowField>
							<ShowField title="Popover oben links">
								<Popover
									orientation="t"
									trigger={<Button>Button</Button>}
								>
									Popover ist oben links angeordnet
								</Popover>
							</ShowField>
							<ShowField title="Popover oben rechts">
								<Popover
									align="r"
									orientation="t"
									trigger={<Button>Button</Button>}
								>
									Popover ist oben rechts angeordnet
								</Popover>
							</ShowField>
							<ShowField title="Deaktiviert">
								<Popover
									trigger={<Button disabled>Button</Button>}
								>
									Inhalt
								</Popover>
							</ShowField>
							<ShowField title="Schließt nicht bei äußerem Klick">
								<Popover
									closeOnClickOutside={false}
									trigger={<Button>Button</Button>}
								>
									Schließt nicht bei äußerem Klick.
									<br></br>
									Den Trigger nochmal betätigen zum Schließen.
								</Popover>
							</ShowField>
							<ShowField title="Auslöser kein Button">
								<Popover
									trigger={
										<span>Für mehr Infos klicken</span>
									}
								>
									Hier sind weitere Informationen
								</Popover>
							</ShowField>
							<ShowField title="Durch Button schließen">
								<Popover
									ref={closePopoverRef}
									closeOnClickOutside={false}
									trigger={<Button>Button</Button>}
								>
									Das Popover kann durch den folgenden Button
									geschlossen werden.
									<br></br>
									<br></br>
									<Button
										onClick={() =>
											closePopoverRef.current?.close()
										}
									>
										Schließen
									</Button>
								</Popover>
							</ShowField>
						</div>
					</section>

					<section id="select">
						<h2>Select</h2>
						<p>
							Zeigt einen Feld mit Auswahlmöglichkeit an.
							<br></br>
							Nutzt den Button und das Popover als Basis.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
							<ShowField title="Standard">
								<Select
									options={[
										{ label: "Eintrag 1", value: 1 },
										{ label: "Eintrag 2", value: 2 },
										{ label: "Eintrag 3", value: 3 },
									]}
								/>
							</ShowField>
							<ShowField title="Mit Suchfunktion">
								<Select
									options={[
										{ label: "Eintrag 1", value: 1 },
										{ label: "Eintrag 2", value: 2 },
										{ label: "Eintrag 3", value: 3 },
										{ label: "Eintrag 4", value: 4 },
										{ label: "Eintrag 5", value: 5 },
										{ label: "Eintrag 6", value: 6 },
									]}
									search={true}
								/>
							</ShowField>
							<ShowField title="Eingegebener Wert">
								<Select
									options={[
										{ label: "Eintrag 1", value: 1 },
										{ label: "Eintrag 2", value: 2 },
										{ label: "Eintrag 3", value: 3 },
									]}
									defaultValue={2}
								/>
							</ShowField>
							<ShowField title="Eingegebener Wert">
								<Select
									options={[
										{ label: "Eintrag 1", value: 1 },
										{ label: "Eintrag 2", value: 2 },
										{ label: "Eintrag 3", value: 3 },
									]}
									disabled
								/>
							</ShowField>
							<ShowField title="Multi-Auswahl">
								<MultiSelect
									options={[
										{ label: "Eintrag 1", value: 1 },
										{ label: "Eintrag 2", value: 2 },
										{ label: "Eintrag 3", value: 3 },
										{ label: "Eintrag 4", value: 4 },
										{ label: "Eintrag 5", value: 5 },
										{ label: "Eintrag 6", value: 6 },
									]}
									search={true}
								/>
							</ShowField>
							<ShowField title="Multi-Auswahl mit eingegebenen Werten">
								<MultiSelect
									options={[
										{ label: "Eintrag 1", value: 1 },
										{ label: "Eintrag 2", value: 2 },
										{ label: "Eintrag 3", value: 3 },
										{ label: "Eintrag 4", value: 4 },
										{ label: "Eintrag 5", value: 5 },
										{ label: "Eintrag 6", value: 6 },
									]}
									search={true}
									defaultValue={[1, 5]}
								/>
							</ShowField>
						</div>
					</section>

					<section id="datepicker">
						<h2>Datumspicker</h2>
						<p>
							Zeigt einen Datumspicker an, mit welchem jahr, Monat
							und zugehöriger Tag gewählt werden können.
							<br></br>
							Der Bereich der wählbaren Tage kann eingestellt
							werden.
							<br></br>
							Nutzt den Button und das Popover als Basis.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
							<ShowField title="Standard">
								<DatePicker></DatePicker>
							</ShowField>
							<ShowField title="Mindestdatum heute">
								<DatePicker minDate={new Date()}></DatePicker>
							</ShowField>
						</div>
						<ShowField title="Datumsbereich">
							<DateRangePicker></DateRangePicker>
						</ShowField>
					</section>

					<section id="datatable">
						<h2>DataTable</h2>
						<p>
							Zeigt einen Tabelle an, die Daten übersichtlich
							anzeigt.
							<br></br>
							Spalten können sortiert und gefiltert werden, sowie
							Aggregationen ausführen. Außerdem lassen sich die
							Ursprungsdaten mittels 'transform'-Funktionen
							ändern. Angezeigte Daten können mittels
							'render'-Funktionen angepasst werden.
							<br></br>
							Nutzt den Button, das Select und das Popover als
							Basis.
						</p>

						<div className="grid grid-cols-1 gap-x-5">
							<ShowField title="Standard">
								<DataTable
									className="w-full"
									title="Tabelle 1"
									columns={[
										{
											title: "ID",
											key: "id",
											sortType: "number",
										},
										{
											title: "Name",
											key: "name",
										},
										{
											title: "Kategorie",
											key: "category",
										},
										{
											title: "Beitrittsdatum",
											key: "date_joined",
											transform: (date) =>
												transformDateString(
													date,
													"dd.MM.yyyy"
												),
											sortType: "dd.MM.yyyy",
										},
										{
											title: "Anzahl Aufträge",
											key: "jobs_count",
											sortType: "number",
										},
										{
											title: "Aktiv",
											key: "active",
											sortType: "boolean",
										},
									]}
									tableData={tableData1}
								></DataTable>
							</ShowField>
							<ShowField title="Rendering, Filter & Aggregation">
								<DataTable
									className="w-full"
									title="Tabelle 2"
									columns={[
										{
											title: "ID",
											key: "id",
											sortType: "number",
											sorted: Direction.ASC,
											aggregate: "count",
										},
										{
											title: "Name",
											key: "name",
											filter: { searchable: true },
										},
										{
											title: "Kategorie",
											key: "category",
											filter: {},
										},
										{
											title: "Beitrittsdatum",
											key: "date_joined",
											transform: (date) =>
												transformDateString(
													date,
													"dd.MM.yyyy"
												),
											sortType: "dd.MM.yyyy",
										},
										{
											title: "Anzahl Aufträge",
											key: "jobs_count",
											sortType: "number",
											aggregate: "sum",
										},
										{
											title: "Aktiv",
											key: "active",
											sortType: "boolean",
											render: BooleanIconRenderer,
											filter: { render: true },
										},
										{
											title: "Aktionen",
											key: "id",
											sortType: "number",
											sortable: false,
											render: (_: any, row: any) => {
												return (
													<Popover
														trigger={
															<Tooltip content="Weitere Aktionen anzeigen">
																<Button className="!p-0.5">
																	<LuEllipsisVertical />
																</Button>
															</Tooltip>
														}
													>
														<div className="flex flex-col gap-y-2">
															<p>
																<b>
																	Angestellter:
																</b>{" "}
																{row["name"]}
															</p>
															<Button>
																Editieren
															</Button>
															<Button>
																Löschen
															</Button>

															<p className="text-xs opacity-50">
																*Funktionen sind
																nur
																<br></br>
																zur
																Demonstration
															</p>
														</div>
													</Popover>
												);
											},
										},
									]}
									tableData={tableData1}
								></DataTable>
							</ShowField>
							<ShowField title="Zu breite Tabelle">
								<DataTable
									className="w-full"
									title="Tabelle 3"
									columns={[
										{
											title: "ID",
											key: "id",
											sortType: "number",
										},
										{
											title: "Name",
											key: "name",
										},
										{
											title: "Kategorie",
											key: "category",
										},
										{
											title: "Beitrittsdatum",
											key: "date_joined",
											transform: (date) =>
												transformDateString(
													date,
													"dd.MM.yyyy"
												),
											sortType: "dd.MM.yyyy",
										},
										{
											title: "Anzahl Aufträge",
											key: "jobs_count",
											sortType: "number",
										},
										{
											title: "Demo Spalte",
											key: "demo_1",
										},
										{
											title: "Demo Spalte",
											key: "demo_2",
										},
										{
											title: "Demo Spalte",
											key: "demo_3",
										},
										{
											title: "Demo Spalte",
											key: "demo_4",
										},
										{
											title: "Demo Spalte",
											key: "demo_5",
										},
										{
											title: "Demo Spalte",
											key: "demo_6",
										},
										{
											title: "Demo Spalte",
											key: "demo_7",
										},
										{
											title: "Demo Spalte",
											key: "demo_8",
										},
										{
											title: "Aktiv",
											key: "active",
											sortType: "boolean",
										},
									]}
									tableData={tableData1}
								></DataTable>
							</ShowField>
							<ShowField title="Suche, Paging, Reset & Informationen deaktiviert">
								<DataTable
									className="w-full"
									title="Tabelle 4"
									searchable={false}
									paging={false}
									info={false}
									resettable={false}
									columns={[
										{
											title: "ID",
											key: "id",
											sortType: "number",
										},
										{
											title: "Name",
											key: "name",
										},
										{
											title: "Kategorie",
											key: "category",
										},
										{
											title: "Beitrittsdatum",
											key: "date_joined",
											transform: (date) =>
												transformDateString(
													date,
													"dd.MM.yyyy"
												),
											sortType: "dd.MM.yyyy",
										},
										{
											title: "Anzahl Aufträge",
											key: "jobs_count",
											sortType: "number",
										},
										{
											title: "Aktiv",
											key: "active",
											sortType: "boolean",
										},
									]}
									tableData={tableData1}
								></DataTable>
							</ShowField>
						</div>
					</section>
				</section>
			</ContentWrapper>
		</div>
	);
};

interface ShowFieldProps extends React.HTMLProps<HTMLDivElement> {
	title: string;
}

const ShowField: React.FC<ShowFieldProps> = ({ ...props }) => {
	return (
		<div className="flex flex-col gap-y-2 w-full my-5">
			<h3 className="font-semibold">{props.title}</h3>
			<div className="border border-(--border) rounded-(--rounded) flex items-center justify-center h-full w-full p-5 md:p-10 lg:p-15 xl:p-20">
				{props.children}
			</div>
		</div>
	);
};

export default Body;
